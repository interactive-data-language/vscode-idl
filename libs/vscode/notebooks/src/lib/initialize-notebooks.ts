import { IDL_NOTEBOOK_LANGUAGE_NAME } from '@idl/shared';
import { IDL_LOGGER } from '@idl/vscode/client';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { RegisterNotebookCommands } from './commands/register-notebook-commands';
import { IDLNotebookController } from './controller/idl-notebook-controller.class';
import { IInitializeNotebooks } from './initialize-notebooks.interface';
import { InitializeNotebookRendererMessenger } from './renderer-messenger/initialize-notebook-renderer-messenger';
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
export function InitializeNotebooks(
  ctx: ExtensionContext
): IInitializeNotebooks {
  IDL_LOGGER.log({
    content: 'Registering notebook serializer and controller',
  });
  ctx.subscriptions.push(
    vscode.workspace.registerNotebookSerializer(
      IDL_NOTEBOOK_LANGUAGE_NAME,
      IDL_NOTEBOOK_SERIALIZER
    )
  );
  ctx.subscriptions.push(IDL_NOTEBOOK_CONTROLLER);

  // create messenger for renderer
  IDL_LOGGER.log({
    content: 'Creating notebook renderer messenger',
  });
  InitializeNotebookRendererMessenger();

  // register our providers for user interactions
  // RegisterNotebookHoverProvider();
  // RegisterNotebookCompletionProvider();
  // RegisterNotebookDefinitionProvider();
  // RegisterNotebookSymbolProvider();

  // register notebook commands
  RegisterNotebookCommands(ctx);

  return {
    controller: IDL_NOTEBOOK_CONTROLLER,
    serializer: IDL_NOTEBOOK_SERIALIZER,
  };
}
