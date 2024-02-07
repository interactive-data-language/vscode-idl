import { IDLProblemCode } from './idl-problem-codes.interface';

/**
 * Regular expression to detect statements that disable problems from being reported
 */
export const DISABLED_PROBLEM_REGEX =
  /idl-disable(?:-next-line|-line){0,1}(.+$)?}/i;

/**
 * Track how problems are disabled
 */
export interface IDisabledProblems {
  /** Do we disable reporting all of our problems */
  all: boolean;
  /** Track problems we disable for the whole file */
  forFile: IDLProblemCode[];
  /**
   * Track problems disabled by line
   *
   * For each line, track the problems as an object for max speed
   *
   */
  forLines: { [key: number]: { [key: number]: undefined } };
}
