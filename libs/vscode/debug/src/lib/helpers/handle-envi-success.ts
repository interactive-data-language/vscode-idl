import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { PopulateENVIError } from '@idl/mcp/envi';
import {
  ENVIMCPToolResponse,
  ENVIMCPToolResponse_Failure,
} from '@idl/types/mcp';
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
  resOrig: string,
): Promise<ENVIMCPToolResponse> {
  // remove IDL print statements
  const res = CleanIDLOutput(resOrig, true, true);

  // parse the text
  const pos = res.indexOf('{');
  const sub = res.substring(pos);

  // parse the text
  const parsed: ENVIMCPToolResponse = JSON.parse(sub);

  // check if we failed
  if (!parsed.success) {
    // log details
    IDL_LOGGER.log({
      type: 'error',
      content: ['Error running in ENVI', parsed, resOrig],
    });

    // map reported error to human string
    PopulateENVIError(parsed);

    // send reason to IDL console
    IDL_DEBUG_ADAPTER.sendEvent(
      new OutputEvent(
        `${(parsed as ENVIMCPToolResponse_Failure).result.err}`,
        'stderr',
      ),
    );

    // alert user
    if ((parsed as ENVIMCPToolResponse_Failure).result.reason) {
      vscode.window.showErrorMessage(
        (parsed as ENVIMCPToolResponse_Failure).result.reason as string,
      );
    }
  }

  return parsed;
}
