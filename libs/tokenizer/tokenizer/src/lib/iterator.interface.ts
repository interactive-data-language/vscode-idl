import { TokenName } from './tokens.interface';

/**
 * Object with easy-access for what tokens have been found
 */
export interface IFoundTokenTypes {
  [key: string]: boolean;
}

/**
 * Data structure as we iterate through our code to find tokens
 */
export interface ICurrent {
  /** Zero-based line number we are currently on */
  line: number;
  /** The current line */
  lineText: string;
  /** Position in the current index we are at */
  linePosition: number;
  /** Subset of our line that is unprocessed */
  sub: string;
  /** Indicates if the current line is a continuation of the previous line */
  continued: boolean;
  /** Track token types we have found so far in our lines */
  foundTypes: IFoundTokenTypes;
  /** When set, the next time we encounter an iterator shift we go to the next line instead */
  skipToNextLine: boolean;
  /** Level of recursion when searching for tokens */
  recursionLevel: number;
  /** When our iterator shifts, do we preserve white space or not */
  parents: TokenName[];
}
