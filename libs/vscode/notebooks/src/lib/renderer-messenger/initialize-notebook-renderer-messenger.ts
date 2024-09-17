import { IDL_NOTEBOOK_RENDERER_NAME } from '@idl/shared';
import { IDLNotebookToRendererBaseMessage } from '@idl/types/notebooks';
import * as vscode from 'vscode';

import { HandleRendererMessage } from './handle-renderer-message';

export let NOTEBOOK_RENDERER_MESSENGER: vscode.NotebookRendererMessaging;

/**
 * Creates messenger for our notebook renderer
 */
export function InitializeNotebookRendererMessenger() {
  NOTEBOOK_RENDERER_MESSENGER = vscode.notebooks.createRendererMessaging(
    IDL_NOTEBOOK_RENDERER_NAME
  );

  NOTEBOOK_RENDERER_MESSENGER.onDidReceiveMessage((e) => {
    HandleRendererMessage(e.editor.notebook, e.message);
  });

  /**
   * Trigger theme change in notebook cell
   */
  vscode.window.onDidChangeActiveColorTheme(() => {
    /** Message for theme change */
    const msg: IDLNotebookToRendererBaseMessage<'theme-change'> = {
      type: 'theme-change',
    };

    // alert renderers
    NOTEBOOK_RENDERER_MESSENGER.postMessage(msg);
  });
}
