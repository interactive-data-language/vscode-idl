import {
  BreakpointParams,
  BreakpointRequest,
} from './requests/idl-machine.breakpoint.interface';
import {
  CommandHistoryParams,
  CommandHistoryRequest,
  CommandHistoryResponse,
} from './requests/idl-machine.command-history.interface';
import {
  GetPrefsParams,
  GetPrefsRequest,
  GetPrefsResponse,
} from './requests/idl-machine.get-prefs.interface';
import {
  GetVarParams,
  GetVarRequest,
  GetVarResponse,
} from './requests/idl-machine.get-var.interface';
import {
  IsQueueEmptyParams,
  IsQueueEmptyRequest,
  IsQueueEmptyResponse,
} from './requests/idl-machine.is-queue-empty.interface';
import {
  SetPrefsParams,
  SetPrefsRequest,
  SetPrefsResponse,
} from './requests/idl-machine.set-prefs.interface';

/**
 * Union type of requests going to the IDL machine
 */
export type ToIDLMachineRequests =
  | BreakpointRequest
  | CommandHistoryRequest
  | GetPrefsRequest
  | GetVarRequest
  | IsQueueEmptyRequest
  | SetPrefsRequest;

/**
 * What parameters are required for requests sent to the IDL Machine?
 */
export type ToIDLMachineRequestParams<T extends ToIDLMachineRequests> =
  T extends BreakpointRequest
    ? BreakpointParams
    : T extends CommandHistoryRequest
    ? CommandHistoryParams
    : T extends GetPrefsRequest
    ? GetPrefsParams
    : T extends GetVarRequest
    ? GetVarParams
    : T extends IsQueueEmptyRequest
    ? IsQueueEmptyParams
    : T extends SetPrefsRequest
    ? SetPrefsParams
    : never;

/**
 * What response do we get back for our messages sent to the IDL Machine?
 */
export type ToIDLMachineRequestResponse<T extends ToIDLMachineRequests> =
  T extends CommandHistoryRequest
    ? CommandHistoryResponse
    : T extends GetPrefsRequest
    ? GetPrefsResponse
    : T extends GetVarRequest
    ? GetVarResponse
    : T extends IsQueueEmptyRequest
    ? IsQueueEmptyResponse
    : T extends SetPrefsRequest
    ? SetPrefsResponse
    : never;
