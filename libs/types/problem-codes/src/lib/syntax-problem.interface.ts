import { PositionArray } from '@idl/types/tokenizer';
import { TextEdit } from 'vscode-languageserver';

import { IDLProblemCode } from './idl-problem-codes.interface';

/**
 * Data structure to represent syntax problems
 */
export interface ISyntaxProblem {
  /** Can we report our problem or not? */
  canReport: boolean;
  // /** Unique ID for the problem */
  // _id: string;
  /** Number for the syntax problem that was detected */
  code: IDLProblemCode;
  /** Any text edits associated with this problem to fix the issue at hand */
  edits?: TextEdit[];
  /** Optional end of the syntax problem `[line, index, length]` */
  end: PositionArray;
  /** The file that the problem occurs in */
  file?: string;
  /** String with basic information about the problem */
  info: string;
  /** Location of the syntax problem `[line, index, length]` */
  start: PositionArray;
}

/**
 * Type for syntax problems
 */
export type SyntaxProblems = ISyntaxProblem[];
