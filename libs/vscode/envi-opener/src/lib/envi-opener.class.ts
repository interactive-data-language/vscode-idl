import { CleanPath, ENVI_OPENER_TYPE } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { OpenInENVI } from '@idl/vscode/debug';
import * as vscode from 'vscode';

/**
 * HTML for our fake editor for ENVI files
 */
const WEBVIEW_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${IDL_TRANSLATION.envi.openerTitle}</title>
</head>
<body>
  <p>${IDL_TRANSLATION.envi.openerText}</p>
</body>
</html>`;

/**
 * Provider for opening files in ENVI. Fake editor that will send a command to ENVI
 * in order to open and display the image.
 */
export class ENVIOpenerProvider implements vscode.CustomTextEditorProvider {
  static readonly viewType = ENVI_OPENER_TYPE;

  /**
   * Called when our custom editor is opened.
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // get the path to our file
    const uri = CleanPath(document.uri.fsPath);

    // simple HTML for panel
    webviewPanel.webview.html = WEBVIEW_HTML;

    OpenInENVI(uri)
      .then(
        () => {
          webviewPanel.dispose();
        },
        () => {
          // do nothing
        }
      )
      .catch(() => {
        // do nothing, handled elsewhere
      });
  }
}
