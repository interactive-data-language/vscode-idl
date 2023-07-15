import { IDL_NOTEBOOK_NAME } from '@idl/shared';
import { IDL_LOGGER } from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IDLNotebookController } from './controller/idl-notebook-controller.class';
import { IDLNotebookSerializer } from './serializer/idl-notebook-serializer.class';

/**
 * Serializer for IDL notebooks
 */
export const IDL_NOTEBOOK_SERIALIZER = new IDLNotebookSerializer();

/**
 * Notebook controller for IDL notebooks
 */
export const IDL_NOTEBOOK_CONTROLLER = new IDLNotebookController();

/**
 * Initializes our tree views
 */
export function InitializeNotebooks(ctx: ExtensionContext) {
  IDL_LOGGER.log({
    content: 'Registering notebook serializer and controller',
  });
  ctx.subscriptions.push(
    vscode.workspace.registerNotebookSerializer(
      IDL_NOTEBOOK_NAME,
      IDL_NOTEBOOK_SERIALIZER
    )
  );
  ctx.subscriptions.push(IDL_NOTEBOOK_CONTROLLER);
}
