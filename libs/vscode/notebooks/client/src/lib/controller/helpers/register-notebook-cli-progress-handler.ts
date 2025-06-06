import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/logger';

import { IDLNotebookExecutionManager } from '../idl-notebook-execution-manager.class';

/**
 * Handles progress messages via IDL Machine for IDL CLI
 */
export function RegisterNotebookCLIProgressHandler(
  manager: IDLNotebookExecutionManager
) {
  // plug in progress messages
  if (manager._runtime.isIDLMachine()) {
    manager._runtime.registerIDLNotifyHandler(
      'cli_progressNotification',
      async (msg) => {
        // return if no cell and we got a message
        if (!manager._currentCell) {
          return 1;
        }

        // attempt to replace
        try {
          await manager._replaceCellOutput(manager._currentCell, msg.param1);
        } catch (err) {
          IDL_LOGGER.log({
            type: 'error',
            log: IDL_NOTEBOOK_LOG,
            content: [
              IDL_TRANSLATION.notebooks.errors.failedToHandleProgress,
              err,
            ],
            alert: IDL_TRANSLATION.notebooks.errors.failedToHandleProgress,
          });
        }
        return 1;
      }
    );
  }
}
