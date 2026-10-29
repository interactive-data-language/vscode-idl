import type {
  AbortNotification,
  AbortParams,
} from './notifications/idl-machine.abort.interface';
import type {
  ExecuteStringNotification,
  ExecuteStringParams,
} from './notifications/idl-machine.execute-string.interface';
import type {
  ExitNotification,
  ExitParams,
} from './notifications/idl-machine.exit.interface';
import type {
  SetTTYSizeNotification,
  SetTTYSizeParams,
} from './notifications/idl-machine.set-tty-size.interface';

/**
 * All types of notifications for the IDL machine
 */
export type ToIDLMachineNotifications =
  | AbortNotification
  | ExecuteStringNotification
  | ExitNotification
  | SetTTYSizeNotification;

/**
 * Parameters for notifications we send to the IDL machine
 */
export type ToIDLMachineNotificationParams<
  T extends ToIDLMachineNotifications,
> = T extends AbortNotification
  ? AbortParams
  : T extends ExecuteStringNotification
    ? ExecuteStringParams
    : T extends ExitNotification
      ? ExitParams
      : T extends SetTTYSizeNotification
        ? SetTTYSizeParams
        : never;
