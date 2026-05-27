import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import { IENVISuccess } from '@idl/types/vscode-debug';

import { PopulateENVIError } from './populate-envi-error';

/**
 * Minimal interface required by `RegisterENVINotifyHandlers`.
 *
 * Both `IIDLExecutionBackend` and `IDLInteractionManager` satisfy this,
 * so the function can be used in VS Code and standalone contexts alike.
 */
interface IENVINotifyBackend {
  registerIDLNotifyHandler(
    event: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>,
  ): void;
}

/**
 * Callback invoked whenever an `envi_success` or `envi_failure`
 * notification arrives from IDL.
 *
 * Implementations store the message so that subsequent calls to
 * `evaluateENVICommand` can read the result.
 */
export type ENVISuccessHandler = (msg: IENVISuccess) => void;

/**
 * Registers `envi_success` and `envi_failure` IDL Notify handlers
 * on any backend that exposes `registerIDLNotifyHandler`.
 *
 * When a notification arrives the JSON payload is parsed, error text
 * is populated via `PopulateENVIError`, and the `onMessage` callback
 * is invoked so the host can store the result (e.g. on the backend
 * instance or in a module-level variable).
 */
export function RegisterENVINotifyHandlers(
  backend: IENVINotifyBackend,
  onMessage: ENVISuccessHandler,
): void {
  backend.registerIDLNotifyHandler('envi_success', async (msg) => {
    const parsed: IENVISuccess = JSON.parse(msg.param1);
    PopulateENVIError(parsed);
    onMessage(parsed);
    return 1;
  });

  backend.registerIDLNotifyHandler('envi_failure', async (msg) => {
    const parsed: IENVISuccess = JSON.parse(msg.param1);
    PopulateENVIError(parsed);
    onMessage(parsed);
    return 1;
  });
}
