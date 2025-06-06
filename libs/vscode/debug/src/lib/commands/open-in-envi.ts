import { CleanPath } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { HandleENVISuccess } from '../helpers/handle-envi-success';
import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { StartIDL } from './start-idl';

/**
 * Opens a dataset in ENVI
 */
export async function OpenInENVI(uri: string): Promise<boolean> {
  try {
    // start IDL by default when trying to open data
    await StartIDL();

    // run our command to open in ENVI
    const res = await IDL_DEBUG_ADAPTER.evaluate(
      `vscode_openData, '${CleanPath(uri)}'`,
      { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: true }
    );

    return (await HandleENVISuccess(res)).succeeded;
  } catch (err) {
    IDL_LOGGER.log({
      type: 'error',
      content: ['Error while opening raster', err],
    });
    vscode.window.showErrorMessage(IDL_TRANSLATION.envi.open.commandError);
    return false;
  }
}
