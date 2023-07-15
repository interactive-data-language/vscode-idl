import { IDL_NOTEBOOK_NAME } from '@idl/shared';
import { IDL_LOGGER } from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IDLNotebookSerializer } from './serializer/idl-notebook-serializer.class';

/**
 * Serializer for IDL notebooks
 */
export const IDL_NOTEBOOK_SERIALIZER = new IDLNotebookSerializer();

/**
 * Initializes our tree views
 */
export function InitializeNotebooks(ctx: ExtensionContext) {
  IDL_LOGGER.log({
    content: 'Registering notebook serializer',
  });
  ctx.subscriptions.push(
    vscode.workspace.registerNotebookSerializer(
      IDL_NOTEBOOK_NAME,
      IDL_NOTEBOOK_SERIALIZER
    )
  );
}
