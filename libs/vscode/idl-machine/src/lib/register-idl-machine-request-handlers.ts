import { IDLInteractionManager } from '@idl/idl/idl-interaction-manager';
import { IDLMachineReadIOLineRequestHandler } from './from-machine-requests/idl-machine-read-io-line-request-handler';

/**
 * Register IDL Machine request handlers for special user interaction
 */
export function RegisterIDLMachineRequestHandlers(
  manager: IDLInteractionManager
) {
  manager.registerRequestHandler(
    'readIOLine',
    IDLMachineReadIOLineRequestHandler
  );
}
