/**
 * Because our IDL class (./idl.class.ts) inherits from EventEmitter,
 * here we strongly type the events that are emitted. Good for docs
 * and helps manage more complex applications (like we have) from silly
 * mistakes
 */

/** Event fired when we close IDL after telling it to stop */
export type ClosedCleanlyEvent = 'closed-cleanly';

/** When IDL is back at its default state. (i.e. paused in routine, recompiled, back to idle state) */
export type ContinueEvent = 'continue';

/** Event fired when IDL crashes or closes unexpectedly */
export type CrashEvent = 'crashed';

/** Event fired when we fail to start IDL */
export type FailedStartEvent = 'failed-start';

/** Emitted when our process ends */
export type EndEvent = 'end';

/** Fired when IDL has started and is ready for input */
export type IDLStartedEvent = 'idl-started';

/**
 * Sent when we have content to display from IDL (i.e. potentially command that
 * runs), but not standout or stderr
 */
export type OutputEvent = 'output';

/** Event the emits the current IDL prompt */
export type PromptEvent = 'prompt';

/** Fired when we are back to our prompt */
export type PromptReadyEvent = 'prompt-ready';

/** When we have output from standard out from IDL */
export type StandardOutEvent = 'stdout';

/** When we have output from standard error from IDL */
export type StandardErrorEvent = 'stderr';

/** When IDL stops (breakpoint, error, interrupt, etc) */
export type StopEvent = 'stopped';

/** When we encounter an unhandled error/exception */
export type UnhandledErrorEvent = 'unhandled-error';

/** Allowed event types */
export type IDLEvent =
  | ClosedCleanlyEvent
  | ContinueEvent
  | CrashEvent
  | EndEvent
  | FailedStartEvent
  | IDLStartedEvent
  | OutputEvent
  | PromptEvent
  | PromptReadyEvent
  | StandardErrorEvent
  | StandardOutEvent
  | StopEvent
  | UnhandledErrorEvent;

/**
 * All allowed event types, strict for below constant
 */
interface IEventLookup {
  /** Event fired when we close IDL after telling it to stop */
  CLOSED_CLEANLY: ClosedCleanlyEvent;
  /** When IDL is back at its default state. (i.e. paused in routine, recompiled, back to idle state) */
  CONTINUE: ContinueEvent;
  /** Event fired when IDL crashes or closes unexpectedly */
  CRASHED: CrashEvent;
  /** Emitted when our process ends */
  END: EndEvent;
  /** Event fired when we fail to start IDL */
  FAILED_START: FailedStartEvent;
  /** Fired when IDL has started and is ready for input */
  IDL_STARTED: IDLStartedEvent;
  /**
   * Sent when we have content to display from IDL (i.e. potentially command that
   * runs), but not standout or stderr
   */
  OUTPUT: OutputEvent;
  /** Event the emits the current IDL prompt */
  PROMPT: PromptEvent;
  /** Fired when we are back to our prompt */
  PROMPT_READY: PromptReadyEvent;
  /** When we have output from standard error from IDL */
  STANDARD_ERR: StandardErrorEvent;
  /** When we have output from standard out from IDL */
  STANDARD_OUT: StandardOutEvent;
  /** When IDL stops (breakpoint, error, interrupt, etc) */
  STOP: StopEvent;
  /** When we encounter an unhandled error/exception */
  UNHANDLED_ERROR: UnhandledErrorEvent;
}

/**
 * Lookup for all events from IDL. Centralized for easy access and makes
 * it easy to change in the future
 */
export const IDL_EVENT_LOOKUP: IEventLookup = {
  CLOSED_CLEANLY: 'closed-cleanly',
  CONTINUE: 'continue',
  CRASHED: 'crashed',
  END: 'end',
  FAILED_START: 'failed-start',
  IDL_STARTED: 'idl-started',
  OUTPUT: 'output',
  PROMPT: 'prompt',
  PROMPT_READY: 'prompt-ready',
  STANDARD_ERR: 'stderr',
  STANDARD_OUT: 'stdout',
  STOP: 'stopped',
  UNHANDLED_ERROR: 'unhandled-error',
};
