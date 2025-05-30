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
}
