/**
 * First match is the index, second is the line number, third is "attributes", and the foruth
 * is the file that it is in
 */
export const IDL_BREAKPOINT_REGEX = /^([0-9]+)\s*([0-9]+)\s*([^\s]*)\s+(.*)/gim;

/**
 * Breakpoint, as reported by IDL
 */
export interface IDLBreakpoint {
  /** The breakpoint index (i.e. ID) */
  idx: number;
  /** Line number, one-based */
  line: number;
  /** File the breakpoint is in */
  file: string;
}
