import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IDLWebView } from './idl-webview';
import { RegisterWebViewCommands } from './register-webview-commands';

/**
 * Initializes our web view
 */
export function InitializeWebView(ctx: ExtensionContext) {
  // register webview
  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer(IDLWebView.viewType, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        IDLWebView.revive(webviewPanel, ctx.extensionPath, state);
      },
    });

    RegisterWebViewCommands(ctx);

    /**
     * Check if we should show our webview
     */
    // if (!IDL_EXTENSION_CONFIG.dontShow.welcomePage) {
    //   vscode.commands.executeCommand(IDL_COMMANDS.WEBVIEW.START);
    // }
  }
}
