/**
 * Regular expression to detect statements that disable problems from being reported
 */
export const DISABLED_PROBLEM_REGEX = /(idl-disable(?:[a-z-]*))(.+)?$/i;

/**
 * Check if an existing line if disabled
 */
export const IS_LINE_DISABLED = /;.*idl-disable-next-line(.+)?$/i;

/**
 * Check if an existing line disables problems for a file
 */
export const IS_FILE_DISABLED = /;\s*idl-disable\s+([a-z-,\s]+)$/i;

/**
 * Track how problems are disabled
 */
export interface IDisabledProblems {
  /** Do we disable reporting all of our problems */
  all: boolean;
  /** Track problems we disable for the whole file */
  forFile: { [key: number]: true };
  /**
   * Track problems disabled by line
   *
   * For each line, track the problems as an object for max speed
   *
   */
  forLines: { [key: number]: { [key: number]: true } };
}
