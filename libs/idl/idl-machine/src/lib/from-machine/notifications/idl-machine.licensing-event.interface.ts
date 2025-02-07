/**
 * Notification that the interpreter has stopped
 */
export type LicensingEventNotification = 'licensingEvent';

/** Parameters for when a command has stopped */
export type LicensingEventParams = {
  /** The type of licensing event */
  event:
    | 'InitializeFailure'
    | 'InitializeSuccess'
    | 'AcquireSuccess'
    | 'AcquireFailure';
  /** Message about event */
  param: string;
};
