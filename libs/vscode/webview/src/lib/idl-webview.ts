import { IDL_WEB_VIEW_LOG } from '@idl/logger';
import { WEB_VIEW_PANEL_ID } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { I18N_FOLDER } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG, UpdateConfigObject } from '@idl/vscode/config';
import {
  IDL_EXTENSION_CONFIG_KEYS,
  IDontShowConfig,
} from '@idl/vscode/extension-config';
import { IDL_LOGGER } from '@idl/vscode/logger';
import {
  IProfilerMessage,
  VSCodeWebViewMessage,
} from '@idl/vscode/webview-shared';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Manages IDL coding webview panels
 */
export class IDLWebView {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  static currentPanel: IDLWebView | undefined;

  static readonly displayName = 'IDL';
  static readonly viewType = WEB_VIEW_PANEL_ID;

  /** Has the webview properly started */
  started = false;
  /** Check if there was an error */
  wasError = false;

  /** Things to cleanup */
  private _disposables: vscode.Disposable[] = [];

  private readonly _extensionPath: string;

  private readonly _panel: vscode.WebviewPanel;

  /** Pending messages to send */
  private _pending: VSCodeWebViewMessage[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    this._extensionPath = extensionPath;

    // Set the webview's initial html content
    this._update();

    // send state of the extension's config
    this.sendCommand({
      command: 'show-on-startup-setting',
      data: IDL_EXTENSION_CONFIG.dontShow.welcomePage,
    });

    // get the color theme
    let theme = vscode.workspace
      .getConfiguration('workbench')
      .get('colorTheme');

    // listen for preference changes
    vscode.workspace.onDidChangeConfiguration((ev) => {
      if (ev.affectsConfiguration('workbench')) {
        const newTheme = vscode.workspace
          .getConfiguration('workbench')
          .get('colorTheme');
        if (newTheme !== theme && IDLWebView.currentPanel !== undefined) {
          this.sendCommand({ command: 'recolor' });
        }

        // save the new theme
        theme = newTheme;
      }
    });

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(
      () => {
        IDL_LOGGER.log({
          log: IDL_WEB_VIEW_LOG,
          type: 'debug',
          content: 'Webview was disposed',
        });
        this.started = false;
        this.dispose();
      },
      null,
      this._disposables
    );

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (e) => {
        if (this._panel.visible) {
          //  DONT UPDATE - do something else for this
          // this._update();
        } else {
          this.started = false;
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message: VSCodeWebViewMessage) => {
        IDL_LOGGER.log({
          log: IDL_WEB_VIEW_LOG,
          type: 'debug',
          content: ['Message from webview', message],
        });
        switch (message.command) {
          case 'alert':
            vscode.window.showErrorMessage(message.data);
            return;
          case 'error':
            IDL_LOGGER.log({
              log: IDL_WEB_VIEW_LOG,
              type: 'error',
              content: ['Unhandled error from IDL webview', message],
              alert: IDL_TRANSLATION.webview.error.unhandledError,
              alertMeta: {
                reportBug: true,
              },
            });

            // update our flag that we had an error
            this.wasError = true;
            return;
          case 'show-on-startup-setting':
            UpdateConfigObject<IDontShowConfig>(
              IDL_EXTENSION_CONFIG_KEYS.dontShow,
              {
                welcomePage: message.data,
              }
            );
            return;
          case 'started':
            IDL_LOGGER.log({
              log: IDL_WEB_VIEW_LOG,
              type: 'debug',
              content: 'Webview has started',
            });
            this.started = true;
            // send some messages
            if (this._pending.length > 0) {
              this._pending.forEach((msg) => {
                this.sendCommand(msg);
              });
              this._pending = [];
            }
            return;
          default:
          // do nothing
        }
      },
      null,
      this._disposables
    );
  }

  static createOrShow(extensionPath: string) {
    IDL_LOGGER.log({
      log: IDL_WEB_VIEW_LOG,
      type: 'debug',
      content: 'Create or show Webview panel',
    });
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (IDLWebView.currentPanel) {
      IDLWebView.currentPanel._panel.reveal(column);
      return;
    }

    // get the directory for our webview
    const viewDir = path.join(extensionPath, 'dist', 'apps', 'idl-webview');
    // const assetsDir = path.join(viewDir, 'assets');
    // const i18nDir = path.join(assetsDir, 'i18n');

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      IDLWebView.viewType,
      IDLWebView.displayName,
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // keep the iframe when it is hidden, but this doesnt seem to do anything
        // THIS GETS BUGGY -not like chrome tabs when hiding, just have to deal
        // with a couple second overhead
        retainContextWhenHidden: false,

        // And restrict the webview to only loading content from our extension's `idl-webview/dist` directory.
        localResourceRoots: [
          vscode.Uri.file(viewDir),
          vscode.Uri.file(I18N_FOLDER),
        ],
      }
    );

    IDLWebView.currentPanel = new IDLWebView(panel, extensionPath);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static revive(panel: vscode.WebviewPanel, extensionPath: string, state: any) {
    IDL_LOGGER.log({
      log: IDL_WEB_VIEW_LOG,
      type: 'debug',
      content: 'Revive Webview panel',
    });
    IDLWebView.currentPanel = new IDLWebView(panel, extensionPath);
  }

  dispose() {
    IDLWebView.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({ command: 'refactor' });
  }

  // wrapper for sending commands to the webview
  // kind of excessive, but very verbose in what each message type is and what we expect
  sendCommand(message: VSCodeWebViewMessage) {
    IDL_LOGGER.log({
      log: IDL_WEB_VIEW_LOG,
      type: 'debug',
      content: `Webview command "${message.command}"`,
    });
    if (!this.started) {
      this._pending.push(message);
      return;
    }
    switch (message.command) {
      case 'profiler':
        this._panel.webview.postMessage(message as IProfilerMessage);
        break;
      case 'recolor':
        this._panel.webview.postMessage(message);
        break;
      default:
        break;
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // get the webview HTML folder
    const webViewFolder = path.join(
      this._extensionPath,
      'dist',
      'apps',
      'idl-webview'
    );
    const index = path.join(webViewFolder, 'index.html');

    // check to see if we are missing our content
    if (!fs.existsSync(webViewFolder) || !fs.existsSync(index)) {
      IDL_LOGGER.log({
        log: IDL_WEB_VIEW_LOG,
        type: 'error',
        content: 'IDL webview content not found',
        alert: IDL_TRANSLATION.webview.content.notFound,
      });
      return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>IDL</title>
            </head>
            <body>
                <h1>HTML webview not found</h1>
            </body>
            </html>`;
    }

    // Local path to main script run in the webview
    const webViewFolderUri = vscode.Uri.file(webViewFolder);

    // And the uri we use to load this script in the webview
    const baseUri = webview.asWebviewUri(webViewFolderUri);

    // read our content from disk
    let strings = fs.readFileSync(index, { encoding: 'utf8' });

    // update the base URI for all links and icons
    strings = strings.replace(
      '<base href="/"',
      `<base href="${String(baseUri)}/"`
    );

    // IDL_LOGGER.log({
    //   log: IDL_WEB_VIEW_LOG,
    //   level: 'debug',
    //   content: ['Web view content', strings],
    // });

    // return changes
    return strings;
  }

  private _update() {
    const webview = this._panel.webview;

    // Vary the webview's content based on where it is located in the editor.
    switch (this._panel.viewColumn) {
      // case vscode.ViewColumn.Two:
      //   this._updateTheView(webview);
      //   return;

      // case vscode.ViewColumn.Three:
      //   this._updateTheView(webview);
      //   return;

      // case vscode.ViewColumn.One:
      default:
        this._updateTheView(webview);
        return;
    }
  }

  private _updateTheView(webview: vscode.Webview) {
    // this._panel.title = catName;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }
}
