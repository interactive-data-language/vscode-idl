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
  /** Indicates if the current line is a continuation of the previous line */
  continued: boolean;
  /** Track token types we have found so far in our lines */
  foundTypes: IFoundTokenTypes;
  /** Zero-based line number we are currently on */
  line: number;
  /** Position in the current index we are at */
  linePosition: number;
  /** The current line */
  lineText: string;
  /** When our iterator shifts, do we preserve white space or not */
  parents: TokenName[];
  /** Level of recursion when searching for tokens */
  recursionLevel: number;
  /** When set, the next time we encounter an iterator shift we go to the next line instead */
  skipToNextLine: boolean;
  /** Subset of our line that is unprocessed */
  sub: string;
}
