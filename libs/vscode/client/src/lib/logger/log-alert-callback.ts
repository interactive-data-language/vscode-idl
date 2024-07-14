import { LogAlertCallback } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { ButtonCallback } from '../helpers/button-callback';

/**
 * Callback for when we have an alert that we need to handle
 */
export const LOG_ALERT_CALLBACK: LogAlertCallback = (options) => {
  if (options.alert) {
    /** File to open */
    let file: string;

    /** Markdown file */
    let docsUrl: string;

    /** Items to display */
    const items: string[] = [];

    // check if we have a message asking to initialize config in a folder
    if (options?.alertMeta?.initConfig) {
      // InitConfig(options.alertMeta.initConfig.folder);
      return;
    }

    // check if we have a file to view
    if (options?.alertMeta?.file !== undefined) {
      file = options?.alertMeta?.file;
      items.push(IDL_TRANSLATION.debugger.logs.viewFile);
    }

    // check if we have an IDL folder to configure
    if (options?.alertMeta?.idlLoc) {
      items.push(IDL_TRANSLATION.debugger.logs.specifyIDLLocation);
    }

    // check if we have an IDL folder to configure
    if (options?.alertMeta?.openFile) {
      OpenFileInVSCode(options?.alertMeta?.openFile);
    }

    // check if we have an IDL folder to configure
    if (options?.alertMeta?.openDocsURL) {
      docsUrl = options?.alertMeta?.openDocsURL;
      items.push(IDL_TRANSLATION.notifications.viewDocs);
    }

    // handle the type of window
    switch (options.type) {
      case 'error':
        items.push(IDL_TRANSLATION.debugger.logs.viewLogs);
        vscode.window
          .showErrorMessage(options.alert, ...items)
          .then((res) => ButtonCallback(res, file, docsUrl));
        break;
      case 'warn':
        vscode.window
          .showWarningMessage(options.alert, ...items)
          .then((res) => ButtonCallback(res, file, docsUrl));
        break;
      case 'info':
        vscode.window
          .showInformationMessage(options.alert, ...items)
          .then((res) => ButtonCallback(res, file, docsUrl));
        break;
      default:
        break;
    }
  }
};
