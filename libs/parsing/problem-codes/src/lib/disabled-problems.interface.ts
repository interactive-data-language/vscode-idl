import { IDLProblemCode } from './idl-problem-codes.interface';

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
