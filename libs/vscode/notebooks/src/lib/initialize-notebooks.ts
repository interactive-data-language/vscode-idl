import { IDL_NOTEBOOK_NAME } from '@idl/shared';
import { IDL_LOGGER } from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { IDLNotebookController } from './controller/idl-notebook-controller.class';
import { RegisterNotebookCompletionProvider } from './providers/register-notebook-completion-provider';
import { RegisterNotebookDefinitionProvider } from './providers/register-notebook-definition-provider';
import { RegisterNotebookHoverProvider } from './providers/register-notebook-hover-provider';
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

  // register our providers for user interactions
  RegisterNotebookHoverProvider();
  RegisterNotebookCompletionProvider();
  RegisterNotebookDefinitionProvider();
}
