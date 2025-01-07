import {
  ContinueEvent,
  CrashEvent,
  EndEvent,
  FailedStartEvent,
  IDLEvent,
  IDLStartedEvent,
  OutputEvent,
  PromptEvent,
  PromptReadyEvent,
  StandardErrorEvent,
  StandardOutEvent,
  StopEvent,
  UnhandledErrorEvent,
} from './events.interface';
import { IDLCallStackItem, StopReason } from './idl.interface';

/**
 * Because our IDL class (./idl.class.ts) inherits from EventEmitter,
 * here we strongly type the arguments for event listeners (i.e. callbacks).
 */

/**
 * No arguments
 */
type ContinuedArgs = [];

/**
 * @param {number} code The exit code if the child exited on its own.
 * @param {string} signal The signal by which the child process was terminated.
 */
type CrashedStartArgs = [code: number, signal: string];

/**
 * No arguments
 */
type EndArgs = [];

/**
 * @param {string} reason The reason that IDL failed to start
 */
type FailedStartArgs = [reason: string];

/**
 * @param {string} output The string content captured when starting IDL
 */
type IDLStartedArgs = [output: string];

/**
 * @param {string} content Standard output from IDL
 */
type OutputArgs = [content: string];

/**
 * @param {string} prompt The current IDL prompt
 */
type PromptArgs = [prompt: string];

/**
 * @param {string} output The content returned from executing something in IDL
 */
type PromptReadyArgs = [output: string];

/**
 * @param {string} output New standard error from IDL
 */
type StandardErrArgs = [output: string];

/**
 * @param {string} output New standard output from IDL
 */
type StandardOutArgs = [output: string];

/**
 * @param {StopReason} reason Reason for stopping
 * @param {IDLCallStackItem} stack Call stack item for where we stopped
 */
type StopArgs = [reason: StopReason, stack: IDLCallStackItem];

/**
 * @param {string} event Event we were responding to with an unhandled error
 * @param {Error} err The error
 */
type UnhandledErrorArg = [event: string, err: Error];

/** Type for arguments */
export type IDLListenerArgs<T extends IDLEvent> = T extends ContinueEvent
  ? ContinuedArgs
  : T extends CrashEvent
  ? CrashedStartArgs
  : T extends EndEvent
  ? EndArgs
  : T extends FailedStartEvent
  ? FailedStartArgs
  : T extends IDLStartedEvent
  ? IDLStartedArgs
  : T extends OutputEvent
  ? OutputArgs
  : T extends PromptEvent
  ? PromptArgs
  : T extends PromptReadyEvent
  ? PromptReadyArgs
  : T extends StandardErrorEvent
  ? StandardErrArgs
  : T extends StandardOutEvent
  ? StandardOutArgs
  : T extends StopEvent
  ? StopArgs
  : T extends UnhandledErrorEvent
  ? UnhandledErrorArg
  : any[];
