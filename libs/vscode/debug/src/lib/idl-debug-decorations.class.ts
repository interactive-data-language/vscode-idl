import { IDLSyntaxErrorLookup } from '@idl/idl';
import { Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { OpenFileInVSCodeFromURI } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import {
  DEBUG_DIAGNOSTIC_COLLECTION,
  IDecorationLookup,
  SYNTAX_ERROR_DECORATION,
} from './idl-debug-decorations.interface';

/**
 * Manages decorating a file when we have a debug session up-and-running
 *
 * This makes sure we apply and reset decorations (or similar items) on-demand
 * and when we open files in VScode.
 */
export class IDLDebugDecorations {
  /**
   * Current decorations to apply to files
   */
  decorations: {
    syntaxErrors: IDecorationLookup;
  } = {
    syntaxErrors: {},
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
            range: new vscode.Range(
              new vscode.Position(problem.line - 1, 0),
              new vscode.Position(problem.line - 1, Number.MAX_VALUE)
            ),
          };
        })
      );
    }
  }

  /**
   * Add syntax error decorations to a
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
  private _resetSyntaxErrorDecorations(reApply = false) {
    /**
     * Get all files we track
     */
    const uriStrings = Object.keys(this.decorations.syntaxErrors);

    // process each file
    for (let i = 0; i < uriStrings.length; i++) {
      /** Get errors */
      const errors = this.decorations.syntaxErrors[uriStrings[i]];

      /** Parse as URI */
      const uri = vscode.Uri.parse(uriStrings[i]);

      // reset
      this.addSyntaxErrorDecorations(uri, []);

      // apply again to handle color theme changes
      if (reApply) {
        this.addSyntaxErrorDecorations(uri, errors);
      }
    }
  }

  /**
   * Resets or re-applies decorations
   */
  reset(reApply = false) {
    this._resetSyntaxErrorDecorations(reApply);
  }
}
