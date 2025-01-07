/**
 * Notification that a breakpoint moved
 */
export type BreakpointMovedNotification = 'breakpointMoved';

/**
 * TODO: Can we get the breakpoint index/ID?
 */

/** Parameters for when a breakpoint was moved */
export type BreakpointMovedParams = {
  /** File we stopped in */
  file: string;
  /** Line number (one based) that we stopped on */
  oldLine: number;
  /** Line number (one based) that we stopped on */
  newLine: number;
  /** Routine we stopped in */
  routine: string;
  enabled: boolean;
  /** Breakpoint condition */
  condition: string;
  once: boolean;
  after: number;
  onRecompile: boolean;
};
