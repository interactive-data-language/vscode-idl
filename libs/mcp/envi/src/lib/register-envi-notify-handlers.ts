import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { IENVISuccess } from '@idl/types/vscode-debug';

import { PopulateENVIError } from './populate-envi-error';

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
 * on any `IIDLExecutionBackend`.
 *
 * When a notification arrives the JSON payload is parsed, error text
 * is populated via `PopulateENVIError`, and the `onMessage` callback
 * is invoked so the host can store the result (e.g. on the backend
 * instance or in a module-level variable).
 */
export function RegisterENVINotifyHandlers(
  backend: IIDLExecutionBackend,
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
