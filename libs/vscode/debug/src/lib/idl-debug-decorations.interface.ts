import * as vscode from 'vscode';

/**
 * VSCode debug diagnostic collection
 */
export const DEBUG_DIAGNOSTIC_COLLECTION =
  vscode.languages.createDiagnosticCollection('idl-debug');

/**
 * Data structure for file decorations
 */
export interface IDecorationLookup {
  [key: string]: vscode.DecorationOptions[];
}

/**
 * Decorate problem lines
 *
 * From: https://github.com/ryanluker/vscode-coverage-gutters/blob/master/package.json#L47-L76
 */
export const SYNTAX_ERROR_DECORATION =
  vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(163, 0, 0, 0.4)',
    light: {
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
    },
  });
