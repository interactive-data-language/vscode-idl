import {
  GetKeyboardParams,
  GetKeyboardRequest,
  GetKeyboardResponse,
} from './requests/idl-machine.get-keyboard.interface';
import {
  IDLNotifyParams,
  IDLNotifyRequest,
  IDLNotifyResponse,
} from './requests/idl-machine.idl-notify.interface';
import {
  ReadIOLineParams,
  ReadIOLineRequest,
  ReadIOLineResponse,
} from './requests/idl-machine.read-io-line.interface';
import {
  ReadProgramLineParams,
  ReadProgramLineRequest,
  ReadProgramLineResponse,
} from './requests/idl-machine.read-program-line.interface';
import {
  ResetSessionConfirmParams,
  ResetSessionConfirmRequest,
  ResetSessionConfirmResponse,
} from './requests/idl-machine.reset-session-confirm.interface';

/**
 * All types of requests from the IDL Machine
 */
export type FromIDLMachineRequests =
  | GetKeyboardRequest
  | IDLNotifyRequest
  | ReadIOLineRequest
  | ReadProgramLineRequest
  | ResetSessionConfirmRequest;

/**
 * Parameters from requests sent by the IDL Machine
 */
export type FromIDLMachineRequestParams<T extends FromIDLMachineRequests> =
  T extends GetKeyboardRequest
    ? GetKeyboardParams
    : T extends IDLNotifyRequest
    ? IDLNotifyParams
    : T extends ReadIOLineRequest
    ? ReadIOLineParams
    : T extends ReadProgramLineRequest
    ? ReadProgramLineParams
    : T extends ResetSessionConfirmRequest
    ? ResetSessionConfirmParams
    : never;

/**
 * Response to the IDL Machine from their requests
 */
export type FromIDLMachineRequestResponse<T extends FromIDLMachineRequests> =
  T extends GetKeyboardRequest
    ? GetKeyboardResponse
    : T extends IDLNotifyRequest
    ? IDLNotifyResponse
    : T extends ReadIOLineRequest
    ? ReadIOLineResponse
    : T extends ReadProgramLineRequest
    ? ReadProgramLineResponse
    : T extends ResetSessionConfirmRequest
    ? ResetSessionConfirmResponse
    : never;
