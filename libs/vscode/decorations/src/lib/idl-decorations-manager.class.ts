import {
  IDL_CODE_COVERAGE_LOOKUP,
  IDLCodeCoverage,
  IDLSyntaxErrorLookup,
} from '@idl/idl';
import { IDLFileHelper, Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  GetTextEditorForURIString,
  OpenFileInVSCodeFromURI,
} from '@idl/vscode/shared';
import * as vscode from 'vscode';

import {
  CODE_COVERAGE_DECORATIONS,
  DEBUG_DIAGNOSTIC_COLLECTION,
  ICodeCoverageLookup,
  IDecorationLookup,
  IDLDecorationsResetFlag,
  IStackTraceLookup,
  STACK_TRACE_DECORATION,
  STACK_TRACE_DECORATION_WITH_GUTTER,
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
    /** Information about the current stack */
    stack: IStackTraceLookup;
  } = {
    syntaxErrors: {},
    coverage: {},
    stack: {},
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
     * Listen to notebook changes
     */
    vscode.workspace.onDidChangeNotebookDocument((event) => {
      /**
       * Get changes
       */
      const changes = event.contentChanges;

      // process each change
      for (let i = 0; i < changes.length; i++) {
        /** Get removed cells */
        const removed = changes[i].removedCells;

        // remove all deleted cells
        for (let j = 0; j < removed.length; j++) {
          this.remove(removed[j].document.uri);
        }
      }
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

    // apply stack trace decorations
    if (asString in this.decorations.stack) {
      this.addStackTraceDecorations(uri, this.decorations.stack[asString]);
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
    const editor = GetTextEditorForURIString(uriString);

    // update decorations
    if (editor !== undefined) {
      editor.setDecorations(decorationType, decorations);
    }
  }

  /**
   * Syncs syntax errors and updates what we track in our decorator
   */
  syncSyntaxErrorDecorations(problems: IDLSyntaxErrorLookup) {
    /** Get paths for files */
    const uriStrings = Object.keys(problems);

    // process each file
    for (let i = 0; i < uriStrings.length; i++) {
      this.addSyntaxErrorDecorations(
        vscode.Uri.parse(uriStrings[i]),
        problems[uriStrings[i]].map((problem) => {
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
      } else {
        delete this.decorations.syntaxErrors[uriStrings[i]];
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
      } else {
        delete this.decorations.coverage[uriStrings[i]];
      }
    }
  }

  /**
   * Add decorations for stack track
   *
   * For PRO files, lines are one-based
   *
   * For notebooks, lines are zero-based
   */
  addStackTraceDecorations(uri: vscode.Uri, lines: number[], gutter = true) {
    /** Get string URI */
    const asString = uri.toString();

    // save decorations
    this.decorations.stack[asString] = lines;

    /**
     * Decorations for lines we are on
     */
    const show: vscode.DecorationOptions[] = [];

    // process each line
    for (let i = 0; i < lines.length; i++) {
      show.push({ range: this._rangeFromLine(lines[i]) });
    }

    // apply decorations
    if (lines.length === 0) {
      this._applyDecorations(
        asString,
        STACK_TRACE_DECORATION_WITH_GUTTER,
        show
      );
      this._applyDecorations(asString, STACK_TRACE_DECORATION, show);
    } else {
      this._applyDecorations(
        asString,
        gutter ? STACK_TRACE_DECORATION_WITH_GUTTER : STACK_TRACE_DECORATION,
        show
      );
    }
  }

  /**
   * Resets stack trace decorations
   *
   * Not private so it can be toggled on and off on demand
   */
  resetStackTraceDecorations(flag: IDLDecorationsResetFlag, reApply = false) {
    /**
     * Get all files we track
     */
    const uriStrings = Object.keys(this.decorations.stack);

    // process each file
    for (let i = 0; i < uriStrings.length; i++) {
      // skip if we cant reset
      if (!this._canResetEntry(uriStrings[i], flag)) {
        continue;
      }

      /** Get stack trace */
      const stack = this.decorations.stack[uriStrings[i]];

      /** Parse as URI */
      const uri = vscode.Uri.parse(uriStrings[i]);

      // reset
      this.addStackTraceDecorations(uri, []);

      // apply again
      if (reApply) {
        this.addStackTraceDecorations(uri, stack);
      } else {
        delete this.decorations.stack[uriStrings[i]];
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
        return IDLFileHelper.isPROCode(file);
      case 'notebook':
        return IDLFileHelper.isIDLNotebookFile(file);
      default:
        return true;
    }
  }

  /**
   * Removes decorations for a given URI
   */
  remove(uri: vscode.Uri) {
    /** Convert to string */
    const asString = uri.toString();

    // remove code coverage
    this.addCodeCoverageDecorations(uri, []);
    delete this.decorations.coverage[asString];

    // remove stack trace
    this.addStackTraceDecorations(uri, []);
    delete this.decorations.stack[asString];

    // remove syntax errors
    this.addSyntaxErrorDecorations(uri, []);
    delete this.decorations.syntaxErrors[asString];
  }

  /**
   * Resets or re-applies decorations
   */
  reset(flag: IDLDecorationsResetFlag, reApply = false) {
    this.resetCodeCoverageDecorations(flag, reApply);
    this.resetStackTraceDecorations(flag, reApply);
    this._resetSyntaxErrorDecorations(flag, reApply);
  }
}
