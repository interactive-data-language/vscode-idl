import { IDLInteractionManager } from '@idl/idl/idl-interaction-manager';
import { IDLMachineReadIOLineRequestHandler } from './from-machine-requests/idl-machine-read-io-line-request-handler';

/**
 * Register IDL Machine request handlers for special user interaction
 */
export function RegisterIDLMachineRequestHandlers(
  manager: IDLInteractionManager
) {
  // i fnot machine, return
  if (!manager.isIDLMachine()) {
    return;
  }

  /**
   * Register request handlers
   */
  manager.registerRequestHandler(
    'readIOLine',
    IDLMachineReadIOLineRequestHandler
  );

  // manager.registerIDLNotifyHandler('cli_progressNotification', params => {
  //   console.log(params.param1)
  //   return 1
  // })

  // /**
  //  * Example custom notification handler
  //  */
  // manager.registerIDLNotifyHandler('my-notification', (params) => {
  //   console.log('Custom notification', params);
  //   return 1;
  // });
}
