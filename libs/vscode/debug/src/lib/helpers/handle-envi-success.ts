import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IDL_TRANSLATION } from '@idl/translation';
import { IENVISuccess } from '@idl/types/vscode-debug';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { OutputEvent } from '@vscode/debugadapter';
import * as vscode from 'vscode';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';

/**
 * Checks an ENVI result for our success message from ENVI
 *
 * Returns a boolean if we ran what we tried to or not
 */
export async function HandleENVISuccess(
  resOrig: string
): Promise<IENVISuccess> {
  // remove IDL print statements
  const res = CleanIDLOutput(resOrig, true, true);

  // parse the text
  const pos = res.indexOf('{');
  const sub = res.substring(pos);

  // parse the text
  const parsed: IENVISuccess = JSON.parse(sub);

  // check if we failed
  if (!parsed.succeeded) {
    // log details
    IDL_LOGGER.log({
      type: 'error',
      content: ['Error running in ENVI', parsed, resOrig],
    });

    // determine the error to tell the user
    let msg = IDL_TRANSLATION.envi.open.defaultError;

    /**
     * Handle our failure cases
     */
    switch (parsed.reason) {
      case 'envi-error':
        msg = IDL_TRANSLATION.envi.open.enviError;
        break;
      case 'envi-not-started':
        msg = IDL_TRANSLATION.envi.task.enviNotStarted;
        break;
      case 'no-envi-ui':
        msg = IDL_TRANSLATION.envi.open.noUI;
        break;
      case 'no-license':
        msg = IDL_TRANSLATION.envi.open.noLicense;
        break;
      case 'open-error':
        msg = IDL_TRANSLATION.envi.open.openError;
        break;
      case 'task-error':
        msg = IDL_TRANSLATION.envi.task.unknownTask;
        break;
      case 'task-execute-error':
        msg = IDL_TRANSLATION.envi.task.unknownParam;
        break;
      case 'task-param-error':
        msg = IDL_TRANSLATION.envi.task.unknownParam;
        break;
      // do nothing
      default:
        break;
    }

    // send reason to IDL console
    IDL_DEBUG_ADAPTER.sendEvent(
      new OutputEvent(`${msg}:\n${parsed.error}`, 'stderr')
    );

    // alert user
    vscode.window.showErrorMessage(msg);
  }

  return parsed;
}
