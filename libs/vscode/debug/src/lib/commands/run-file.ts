import { CleanIDLOutput } from '@idl/idl';
import { CleanPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { GetActivePROCodeWindow } from '@idl/vscode/shared';
import { OutputEvent } from '@vscode/debugadapter';
import { basename, extname } from 'path';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Compile current pro file and runs
 */
export async function RunFile() {
  if (VerifyIDLHasStarted(true)) {
    // get code and make sure it is ready for use
    const code = GetActivePROCodeWindow(true);
    if (!code) {
      return;
    }
    await code.save();

    // get the path for the file
    const uri = CleanPath(code.uri.fsPath);

    // compile our file
    const output = CleanIDLOutput(
      await IDL_DEBUG_ADAPTER.evaluate(`.compile -v '${uri}'`, {
        echo: true,
      })
    );

    // check if we had a main level program
    if (output.includes('$MAIN$')) {
      await IDL_DEBUG_ADAPTER.evaluate(`.go`, {
        echo: true,
      });
    } else {
      // get base name for routine
      const base = basename(uri, extname(uri));

      // check if we compiled a matching routine
      if (output.includes(` ${base.toUpperCase()}.`)) {
        const info: { procedure: boolean; function: boolean } = JSON.parse(
          CleanIDLOutput(
            await IDL_DEBUG_ADAPTER.evaluate(`vscode_findRoutine, '${base}'`, {
              silent: true,
              echo: false,
            })
          )
        );

        // determine how to proceed
        switch (true) {
          // call as procedure
          case info.procedure:
            await IDL_DEBUG_ADAPTER.evaluate(base, {
              echo: true,
            });
            break;
          // call as function
          case info.function:
            await IDL_DEBUG_ADAPTER.evaluate(`!null = ${base}()`, {
              echo: true,
            });
            break;
          default:
            IDL_DEBUG_ADAPTER.sendEvent(
              new OutputEvent(
                `${IDL_TRANSLATION.debugger.adapter.noRoutineFound}\n`
              )
            );
            break;
        }
      } else {
        IDL_DEBUG_ADAPTER.sendEvent(
          new OutputEvent(
            `${IDL_TRANSLATION.debugger.adapter.noRoutineFound}\n`
          )
        );
      }
    }
  }
}
