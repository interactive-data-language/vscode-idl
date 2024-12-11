import {
  BreakpointMovedNotification,
  BreakpointMovedParams,
} from './notifications/idl-machine.breakpoint-movedt.interface';
import {
  CommandFinishedNotification,
  CommandFinishedParams,
} from './notifications/idl-machine.command-finished.interface';
import {
  CommandStartedNotification,
  CommandStartedParams,
} from './notifications/idl-machine.command-started.interface';
import {
  DebugSendNotification,
  DebugSendParams,
} from './notifications/idl-machine.debug-send.interface';
import {
  InterpreterStoppedNotification,
  InterpreterStoppedParams,
} from './notifications/idl-machine.interpreter-stopped.interface';
import {
  ServerReadyNotification,
  ServerReadyParams,
} from './notifications/idl-machine.server-ready.interface';
import {
  ShowBreakpointNotification,
  ShowBreakpointParams,
} from './notifications/idl-machine.show-breakpoint.interface';
import {
  TOutNotification,
  TOutParams,
} from './notifications/idl-machine.tout.interface';

/**
 * All types of notifications from the IDL Machine
 */
export type FromIDLMachineNotifications =
  | BreakpointMovedNotification
  | CommandFinishedNotification
  | CommandStartedNotification
  | DebugSendNotification
  | InterpreterStoppedNotification
  | ServerReadyNotification
  | ShowBreakpointNotification
  | TOutNotification;

/**
 * Parameters for notifications from the IDL Machine
 */
export type FromIDLMachineNotificationParams<
  T extends FromIDLMachineNotifications
> = T extends BreakpointMovedNotification
  ? BreakpointMovedParams
  : T extends CommandFinishedNotification
  ? CommandFinishedParams
  : T extends CommandStartedNotification
  ? CommandStartedParams
  : T extends DebugSendNotification
  ? DebugSendParams
  : T extends InterpreterStoppedNotification
  ? InterpreterStoppedParams
  : T extends ServerReadyNotification
  ? ServerReadyParams
  : T extends ShowBreakpointNotification
  ? ShowBreakpointParams
  : T extends TOutNotification
  ? TOutParams
  : never;
