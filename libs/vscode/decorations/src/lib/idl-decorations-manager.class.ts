import {
  IDL_CODE_COVERAGE_LOOKUP,
  IDLCodeCoverage,
  IDLSyntaxErrorLookup,
} from '@idl/idl';
import { ExtensionFileType, Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { OpenFileInVSCodeFromURI } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import {
  CODE_COVERAGE_DECORATIONS,
  DEBUG_DIAGNOSTIC_COLLECTION,
  ICodeCoverageLookup,
  IDecorationLookup,
  IDLDecorationsResetFlag,
  SYNTAX_ERROR_DECORATION,
} from './idl-decorations-manager.interface';

/**
 * Manages decorating a file when we have a debug session up-and-running
 *
 * This makes sure we apply and reset decorations (or similar items) on-demand
 * and when we open files in VScode.
 */
export class IDLDecorationsManager {
  /**
   * Current decorations to apply to files
   */
  decorations: {
    /** Information about syntax errors */
    syntaxErrors: IDecorationLookup;
    /** Information about code coverage */
    coverage: ICodeCoverageLookup;
  } = {
    syntaxErrors: {},
    coverage: {},
  };

  /**
   * Creates an instance of this object which listens for files to open
   * so that we can add decorations to them automatically
   */
  constructor() {
    // add to files when we open them
    vscode.workspace.onDidOpenTextDocument(async (doc) => {
      /**
       * Yet again, mismatch between VSCode API states
       *
       * We need this so that visibleTextEditors is up-to-date with
       * the latest value
       *
       * Otherwise we try to draw our decorations and we can't
       */
      await Sleep(100);

      // add decorations to the file we opened
      this.applyDecorations(doc.uri);
    });

    /**
     * DONT DO ANYTHING ON COLOR THEME CHANGE
     *
     * Instead, make sure that themes have light and dark specified
     * like the syntax errors do
     */
    // vscode.window.onDidChangeActiveColorTheme(() => {
    //   this.reset(true);
    // });
  }

  /**
   * Callback that applies all decorations to a file
   */
  applyDecorations(uri: vscode.Uri) {
    // check for debug decorations
    const asString = uri.toString();

    // apply syntax errors
    if (asString in this.decorations.syntaxErrors) {
      this.addSyntaxErrorDecorations(
        uri,
        this.decorations.syntaxErrors[asString]
      );
    }

    // apply code coverage
    if (asString in this.decorations.coverage) {
      this.addCodeCoverageDecorations(uri, this.decorations.coverage[asString]);
    }
  }

  /**
   * Applied decorations to a file of a given type
   */
  private _applyDecorations(
    uriString: string,
    decorationType: vscode.TextEditorDecorationType,
    decorations: vscode.DecorationOptions[]
  ) {
    /** Get an open editor */
    const openEditor = vscode.window.visibleTextEditors.filter(
      (editor) => editor.document.uri.toString() === uriString
    );

    // update decorations
    if (openEditor.length > 0) {
      openEditor[0].setDecorations(decorationType, decorations);
    }
  }

  /**
   * Syncs syntax errors and updates what we track in our decorator
   */
  syncSyntaxErrorDecorations(problems: IDLSyntaxErrorLookup) {
    /** Get paths for files */
    const files = Object.keys(problems);

    // process each file
    for (let i = 0; i < files.length; i++) {
      this.addSyntaxErrorDecorations(
        vscode.Uri.file(files[i]),
        problems[files[i]].map((problem) => {
          return {
            range: this._rangeFromLine(problem.line - 1),
          };
        })
      );
    }
  }

  /**
   * Add decorations for syntax errors which makes lines appear red
   * and adds problems to the diagnostics
   */
  addSyntaxErrorDecorations(
    uri: vscode.Uri,
    decorations: vscode.DecorationOptions[]
  ) {
    /** Get string URI */
    const asString = uri.toString();

    // save decorations
    this.decorations.syntaxErrors[asString] = decorations;

    // convert to diagnostics
    const diags: vscode.Diagnostic[] = decorations.map((decoration) => {
      const diag: vscode.Diagnostic = {
        message: IDL_TRANSLATION.debugger.adapter.syntaxError,
        range: decoration.range,
        severity: vscode.DiagnosticSeverity.Error,
      };
      return diag;
    });

    // update diagnostic collection
    DEBUG_DIAGNOSTIC_COLLECTION.set(uri, diags);

    // apply decorations
    this._applyDecorations(asString, SYNTAX_ERROR_DECORATION, decorations);

    // if we have problems, open the file
    if (diags.length > 0) {
      OpenFileInVSCodeFromURI(uri);
    }
  }

  /**
   * Resets syntax error decorations
   */
  private _resetSyntaxErrorDecorations(
    flag: IDLDecorationsResetFlag,
    reApply = false
  ) {
    /**
     * Get all files we track
     */
    const uriStrings = Object.keys(this.decorations.syntaxErrors);

    // process each file
    for (let i = 0; i < uriStrings.length; i++) {
      // skip if we cant reset
      if (!this._canResetEntry(uriStrings[i], flag)) {
        continue;
      }

      /** Get errors */
      const errors = this.decorations.syntaxErrors[uriStrings[i]];

      /** Parse as URI */
      const uri = vscode.Uri.parse(uriStrings[i]);

      // reset
      this.addSyntaxErrorDecorations(uri, []);

      // apply again
      if (reApply) {
        this.addSyntaxErrorDecorations(uri, errors);
      }
    }
  }

  /**
   * Add decorations for code coverage
   */
  addCodeCoverageDecorations(uri: vscode.Uri, coverage: IDLCodeCoverage) {
    /** Get string URI */
    const asString = uri.toString();

    // save decorations
    this.decorations.coverage[asString] = coverage;

    /**
     * Decorations for code we dont run
     */
    const notExecuted: vscode.DecorationOptions[] = [];

    /**
     * Decorations for code we run
     */
    const executed: vscode.DecorationOptions[] = [];

    // process each line
    for (let i = 0; i < coverage.length; i++) {
      // check coverage for our line
      switch (coverage[i]) {
        /**
         * Did we run the line?
         */
        case IDL_CODE_COVERAGE_LOOKUP.EXECUTED:
          executed.push({ range: this._rangeFromLine(i) });
          break;
        /**
         * Did we not run the line?
         */
        case IDL_CODE_COVERAGE_LOOKUP.NOT_EXECUTED:
          notExecuted.push({ range: this._rangeFromLine(i) });
          break;
        /**
         * Comment or white space
         */
        default:
          // do nothing
          break;
      }
    }

    // apply decorations
    this._applyDecorations(
      asString,
      CODE_COVERAGE_DECORATIONS.EXECUTED,
      executed
    );
    this._applyDecorations(
      asString,
      CODE_COVERAGE_DECORATIONS.NOT_EXECUTED,
      notExecuted
    );
  }

  /**
   * Resets code coverage decorations
   *
   * Not private so it can be toggled on and off on demand
   */
  resetCodeCoverageDecorations(flag: IDLDecorationsResetFlag, reApply = false) {
    /**
     * Get all files we track
     */
    const uriStrings = Object.keys(this.decorations.coverage);

    // process each file
    for (let i = 0; i < uriStrings.length; i++) {
      // skip if we cant reset
      if (!this._canResetEntry(uriStrings[i], flag)) {
        continue;
      }

      /** Get code coverage */
      const coverage = this.decorations.coverage[uriStrings[i]];

      /** Parse as URI */
      const uri = vscode.Uri.parse(uriStrings[i]);

      // reset
      this.addCodeCoverageDecorations(uri, []);

      // apply again
      if (reApply) {
        this.addCodeCoverageDecorations(uri, coverage);
      }
    }
  }

  /**
   * Creates a VSCode range that covers an entire line
   */
  private _rangeFromLine(line: number) {
    return new vscode.Range(
      new vscode.Position(line, 0),
      new vscode.Position(line, Number.MAX_VALUE)
    );
  }

  /**
   * Detects the type of file we are wanting to reset and determines if
   * we can or not
   */
  private _canResetEntry(file: string, flag: IDLDecorationsResetFlag): boolean {
    switch (flag) {
      case 'pro':
        return ExtensionFileType.isPROCode(file);
      case 'notebook':
        return ExtensionFileType.isIDLNotebookFile(file);
      default:
        return true;
    }
  }

  /**
   * Resets or re-applies decorations
   */
  reset(flag: IDLDecorationsResetFlag, reApply = false) {
    this._resetSyntaxErrorDecorations(flag, reApply);
    this.resetCodeCoverageDecorations(flag, reApply);
  }
}
