import { PositionArray } from '@idl/parsing/tokenizer-types';

import { IDLProblemCode } from './idl-problem-codes.interface';

/**
 * Data structure to represent syntax problems
 */
export interface ISyntaxProblem {
  // /** Unique ID for the problem */
  // _id: string;
  /** Number for the syntax problem that was detected */
  code: IDLProblemCode;
  /** String with basic information about the problem */
  info: string;
  /** Location of the syntax problem `[line, index, length]` */
  start: PositionArray;
  /** Optional end of the syntax problem `[line, index, length]` */
  end: PositionArray;
  /** The file that the problem occurs in */
  file?: string;
}

/**
 * Type for syntax problems
 */
export type SyntaxProblems = ISyntaxProblem[];
