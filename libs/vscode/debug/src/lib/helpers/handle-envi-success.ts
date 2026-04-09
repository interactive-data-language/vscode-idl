import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IENVISuccess } from '@idl/types/vscode-debug';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { OutputEvent } from '@vscode/debugadapter';
import * as vscode from 'vscode';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { PopulateENVIError } from './populate-envi-error';

/**
 * Checks an ENVI result for our success message from ENVI
 *
 * Returns a boolean if we ran what we tried to or not
 */
export async function HandleENVISuccess(
  resOrig: string,
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

    // map reported error to human string
    PopulateENVIError(parsed);

    // send reason to IDL console
    IDL_DEBUG_ADAPTER.sendEvent(new OutputEvent(`${parsed.error}`, 'stderr'));

    // alert user
    vscode.window.showErrorMessage(parsed.reason);
  }

  return parsed;
}
