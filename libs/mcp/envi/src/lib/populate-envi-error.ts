import { IDL_TRANSLATION } from '@idl/translation';
import { IENVISuccess } from '@idl/types/vscode-debug';

/**
 * Checks a message from ENVI and, if we have an error, maps
 * the error reason to something more tangible
 */
export function PopulateENVIError(msg: IENVISuccess) {
  // return if we dont have a reason
  if (msg.succeeded || !msg.reason) {
    return;
  }

  // determine the error to tell the user
  let errMsg = IDL_TRANSLATION.envi.defaultError;

  /**
   * Handle our failure cases
   */
  switch (msg.reason) {
    // generic ENVI error
    case 'envi-error':
      errMsg = IDL_TRANSLATION.envi.defaultError;
      break;
    case 'envi-not-started':
      errMsg = IDL_TRANSLATION.envi.task.enviNotStarted;
      break;
    case 'envi-open-error':
      errMsg = IDL_TRANSLATION.envi.open.enviError;
      break;
    case 'no-envi-agent-license':
      errMsg = IDL_TRANSLATION.mcp.errors.noLicense;
      break;
    case 'no-envi-ui':
      errMsg = IDL_TRANSLATION.envi.open.noUI;
      break;
    case 'open-error':
      errMsg = IDL_TRANSLATION.envi.open.openError;
      break;
    case 'task-error':
      errMsg = IDL_TRANSLATION.envi.task.unknownTask;
      break;
    case 'task-execute-error':
      errMsg = IDL_TRANSLATION.envi.task.executeError;
      break;
    case 'task-param-error':
      errMsg = IDL_TRANSLATION.envi.task.taskParamError;
      break;
    // do nothing
    default:
      break;
  }

  // update
  msg.reason = `${errMsg}. Original reason: "${msg.reason}"`;
}
