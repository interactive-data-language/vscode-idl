import {
  IDLNotifyParams,
  IDLNotifyRequest,
  IDLNotifyResponse,
} from './requests/idl-machine.idl-notify.interface';

/**
 * All types of requests from the IDL Machine
 */
export type FromIDLMachineRequests = IDLNotifyRequest;

/**
 * Parameters from requests sent by the IDL Machine
 */
export type FromIDLMachineRequestParams<T extends FromIDLMachineRequests> =
  T extends IDLNotifyRequest ? IDLNotifyParams : never;

/**
 * Response to the IDL Machine from their requests
 */
export type FromIDLMachineRequestResponse<T extends FromIDLMachineRequests> =
  T extends IDLNotifyRequest ? IDLNotifyResponse : never;
