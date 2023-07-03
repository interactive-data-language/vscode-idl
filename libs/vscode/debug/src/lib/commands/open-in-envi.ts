import { CleanPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import { OutputEvent } from '@vscode/debugadapter';
import * as vscode from 'vscode';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { StartIDL } from './start-idl';

/**
 * Opens a dataset in ENVI
 */
export async function OpenInENVI(uri: string) {
  try {
    // start IDL by default when trying to open data
    await StartIDL();

    // run our command to open in ENVI
    const res = await IDL_DEBUG_ADAPTER.evaluate(
      `vscode_openData, '${CleanPath(uri)}'`,
      { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: true }
    );

    // parse the text
    const pos = res.indexOf('{');
    const sub = res.substring(pos);

    // parse the text
    const parsed: { succeeded: boolean; reason: string; error: string } =
      JSON.parse(sub);

    // check if we failed
    if (!parsed.succeeded) {
      // log details
      IDL_LOGGER.log({
        type: 'error',
        content: ['Error opening raster', parsed],
      });

      // determine the error to tell the user
      let msg = IDL_TRANSLATION.envi.open.defaultError;

      switch (parsed.reason) {
        case 'envi-error':
          msg = IDL_TRANSLATION.envi.open.enviError;
          break;
        case 'no-envi-ui':
          msg = IDL_TRANSLATION.envi.open.noUI;
          break;
        case 'open-error':
          msg = IDL_TRANSLATION.envi.open.openError;
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
  } catch (err) {
    IDL_LOGGER.log({
      type: 'error',
      content: ['Error while opening raster', err],
    });
    vscode.window.showErrorMessage(IDL_TRANSLATION.envi.open.commandError);
  }
}
