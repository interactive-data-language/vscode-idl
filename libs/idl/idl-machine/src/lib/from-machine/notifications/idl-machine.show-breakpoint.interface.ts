/**
 * Notification that a breakpoint changed via the `breakpoint` procedure
 */
export type ShowBreakpointNotification = 'showBreakpoint';

type BreakpointSet = 0x1;
type BreakpointCleared = 0x2;
type BreakpointEnabled = 0x4;
type BreakpointDisabled = 0x8;

/**
 * Why the breakpoint changed
 */
type BreakpointState =
  | BreakpointSet
  | BreakpointCleared
  | BreakpointDisabled
  | BreakpointEnabled;

/** Parameters for when a breakpoint was updated */
export type ShowBreakpointParams = {
  /** File we stopped in */
  file: string;
  /** Line number (one based) that we stopped on */
  line: number;
  /** The type of change */
  state: BreakpointState;
  /** Routine we stopped in */
  routine: string;
  enabled: boolean;
  /** Breakpoint condition */
  condition: string;
  once: boolean;
  after: number;
  /** Is "R" upper case? */
  onRecompile: boolean;
};
