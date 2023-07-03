import { IDL_TREE_CLICK_HANDLER_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { IDLAction } from './idl-action.class';

/**
 * Handles when an item is clicked from our tree
 */
export class IDLTreeClickHandler {
  async clickedItem(item: IDLAction): Promise<void> {
    // skip conditions
    if (item === undefined || item.contextValue === 'parent') {
      return;
    }

    // determine what to do, ignore parent requests
    try {
      switch (true) {
        case item.contextValue === 'child':
          // alert user if needed
          IDL_LOGGER.log({
            log: IDL_TREE_CLICK_HANDLER_LOG,
            type: 'debug',
            content: `Clicked on button "${item.label}"`,
          });

          // determine if we are a command or not
          await vscode.commands.executeCommand(item.commandName);
          break;
        default:
        // do nothing because it is a parent
      }
    } catch (err) {
      // alert user if needed
      IDL_LOGGER.log({
        log: IDL_TREE_CLICK_HANDLER_LOG,
        type: 'error',
        content: ['Error while handling IDL tree click event', err],
        alert: IDL_TRANSLATION.idl.tree.clickHandlerError,
      });
    }

    return;
  }
}
