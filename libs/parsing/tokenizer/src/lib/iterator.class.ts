import { CancellationToken } from '@idl/cancellation-tokens';
import { PositionArray } from '@idl/parsing/tokenizer-types';

import { GetMatchesArray } from './helpers/get-matches-array';
import { NOT_EMPTY_LINE_REGEX } from './helpers/is-empty-line';
import { Split } from './helpers/split';
import { ICurrent } from './iterator.interface';
import {
  IBasicToken,
  IDetailedPosition,
  IPosition,
  PRESERVE_INTERIOR_SPACE,
  TOKEN_TYPES,
  TokenizerToken,
} from './tokenizer.interface';
import {
  CommentToken,
  TOKEN_NAMES,
  TokenName,
  UnknownToken,
} from './tokens.interface';
import { COMMENT } from './tokens/defs/comment.interface';
import {
  COMMENT_ONLY_TEST,
  NON_SPACE_CHARACTER,
} from './tokens/regex.interface';

/**
 * Class that handles looping through our code string.
 *
 * Internally it separates code by new line characters and
 * processes a single line at a time.
 */
export class Iterator {
  /** Code separated by lines */
  split: string[];

  /** Track which lines we should process */
  process: boolean[];

  /** Track if we have processed our line for leftovers already since we could get called more than once */
  processedLeftovers: boolean[];

  /** Current position of our iterator */
  current: ICurrent;

  /** Tokens we have found in our code */
  tokens: TokenizerToken<TokenName>[] = [];

  /** Set flag if we have code to process or not */
  canProcess = false;

  /** Flag that indicates if our iterator is done or not */
  done = false;

  /** Are we doing a full parse or not */
  full: boolean;

  /** Cancellation token */
  cancel: CancellationToken;

  constructor(code: string | string[], cancel: CancellationToken, full = true) {
    /** Split our strings */
    this.split = Split(code);
    this.processedLeftovers = new Array(this.split.length).fill(false);
    this.full = full;
    this.cancel = cancel;

    // initialize current
    this.current = {
      line: 0,
      lineText: '',
      linePosition: 0,
      sub: '',
      continued: false,
      foundTypes: {},
      skipToNextLine: false,
      recursionLevel: 0,
      parents: [],
    };

    // initialize the process flags
    let startIdx = -1;
    this.process = [];
    for (let i = 0; i < this.split.length; i++) {
      this.process[i] =
        NOT_EMPTY_LINE_REGEX.test(this.split[i]) &&
        !COMMENT_ONLY_TEST.test(this.split[i]);

      // check if we need to do some pre-processing for our line
      if (startIdx === -1) {
        if (this.process[i]) {
          startIdx = i;
        } else {
          // check for comment
          if (COMMENT_ONLY_TEST.test(this.split[i])) {
            // const match = Match(this.split[i], COMMENT.start, true);
            const match = COMMENT.match.exec(this.split[i]);
            if (match !== null) {
              const basic: IBasicToken<TokenName> = {
                type: TOKEN_TYPES.BASIC,
                name: TOKEN_NAMES.COMMENT,
                pos: [i, match.index, match[0].length],
                matches: GetMatchesArray(match),
              };
              this.foundToken(basic);
            }
          }
        }
      }
    }

    // check if we need to return
    if (startIdx === -1) {
      return;
    }

    // found a line to process, so update our flag
    this.canProcess = true;

    // update current properties
    this.current.line = startIdx;
    this.current.lineText = this.split[startIdx];
    this.current.sub = this.split[startIdx];
    this.current.foundTypes = {};
  }

  /**
   * Returns information about if we can skip our line and move to the next one
   */
  canProcessLine() {
    return this.process[this.current.line];
  }

  /**
   * Gives us detailed information about our match position
   */
  detailedPosition(match?: RegExpMatchArray): IDetailedPosition {
    if (match !== undefined) {
      return {
        line: this.current.line,
        index: this.current.linePosition + match.index,
        length: match[0].length,
      };
    } else {
      return {
        line: this.current.line,
        index: this.current.linePosition,
        length: 0,
      };
    }
  }

  /**
   * Gives us detailed information about our match position
   */
  positionArray(match?: RegExpMatchArray): PositionArray {
    if (match !== undefined) {
      return [
        this.current.line,
        this.current.linePosition + match.index,
        match[0].length,
      ];
    } else {
      return [this.current.line, this.current.linePosition, 0];
    }
  }

  /**
   * Gives our position in our iterator and, optionally, accounts for the
   * starting index of a match
   */
  position(match?: RegExpMatchArray): IPosition {
    if (match !== undefined) {
      return {
        line: this.current.line,
        index: this.current.linePosition + match.index,
      };
    } else {
      return {
        line: this.current.line,
        index: this.current.linePosition,
      };
    }
  }

  /**
   * Shifts our iterator based on the current match from a regular expression.
   *
   * Uses Iterator::shift internally.
   */
  shiftByMatch(match: RegExpExecArray) {
    return this.shift(match.index + match[0].length, match.index);
  }

  /**
   * Shifts our active position further down the line.
   *
   * Returns a value of `true` when we are ready to go to the
   * next line.
   */
  shift(increment: number, tokenStart: number) {
    // const increment = Math.max(inCrement, 1);
    // if (increment >= this.current.sub.length - 1) {
    //   return true;
    // }

    // check for cancellation
    this.cancel.throwIfCancelled();

    // get the text before token start that we are shifting for
    if (tokenStart > 0 && this.full) {
      const before = this.current.sub.substring(0, tokenStart);
      if (before.trim() !== '') {
        const basic: IBasicToken<UnknownToken> = {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.UNKNOWN,
          pos: [this.current.line, this.current.linePosition, tokenStart],
          matches: [before],
        };

        // save our token
        this.insertToken(basic);
      }
    }

    // get our increment based on string length
    const useInc = Math.min(increment, this.current.sub.length);

    // update our current position
    this.current.linePosition += useInc;
    this.current.sub = this.current.sub.substring(useInc);

    // skip white space
    this._skipOverSpaces();

    // we can
    return this.current.sub === '';
  }

  /**
   * Handles skipping white space as we iterate and manages internal checks to verify
   * that we can shift
   */
  private _skipOverSpaces() {
    // check if we can remove white space
    let shift = true;
    if (this.current.parents.length > 0) {
      shift = !(
        this.current.parents[this.current.parents.length - 1] in
        PRESERVE_INTERIOR_SPACE
      );
    }

    if (this.current.sub.length !== 0 && shift) {
      const match = NON_SPACE_CHARACTER.exec(this.current.sub);
      if (match !== null) {
        if (match.index > 0) {
          this.current.linePosition += match.index;
          this.current.sub = this.current.sub.substring(match.index);
        }
      }
    }
  }

  /**
   * Method called when we find a token to save it
   */
  foundToken(token: TokenizerToken<TokenName>) {
    // save our token type
    this.current.foundTypes[token.name] = true;

    // save our token
    this.tokens.push(token);
  }

  /**
   * Inserts a token into our found tokens, finds the
   * correct position and inserts.
   */
  insertToken(add: TokenizerToken<TokenName>) {
    // reverse search for where we fit
    const l = this.tokens.length;

    // simple condition with no tokens
    if (l === 0) {
      this.tokens.push(add);
    }

    // find our placement
    for (let i = 0; i < l; i++) {
      // when our token is in front of another token, we have gone too far
      if (
        this.tokens[l - i - 1].pos[0] < add.pos[0] ||
        add.pos[1] >= this.tokens[l - i - 1].pos[1]
      ) {
        this.tokens.splice(l - i, 0, add);
        break;
      }
    }
  }

  /**
   * Checks the current line for leftover tokens
   */
  private findLeftovers() {
    if (!this.full) {
      return;
    }

    // get current line
    const line = this.current.line;

    // check if we have processed
    if (this.processedLeftovers[line]) {
      return;
    }

    // check if we have leftovers to process - which could be because
    // there were no more matches in our line
    if (this.current.sub.trim() !== '') {
      const basic: IBasicToken<UnknownToken> = {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNKNOWN,
        pos: [line, this.current.linePosition, this.current.sub.length],
        matches: [this.current.sub],
      };

      // add our token into the tree
      this.insertToken(basic);
    }

    // update our flag
    this.processedLeftovers[line] = true;
  }

  /**
   * Continue parsing code, returns a flag if we are done or not.
   *
   * Automatically skips empty lines so we don't have to add fancy checks for
   * complicated empty  logic
   */
  nextLine(isContinuedLine = false): boolean {
    // check for cancellation
    this.cancel.throwIfCancelled();

    // check our current line for leftovers
    this.findLeftovers();

    // return if nothing to finish
    if (this.current.line >= this.split.length - 1) {
      this.done = true;
      return false;
    }

    // find the next empty line
    let i: number;
    for (i = this.current.line + 1; i < this.split.length; i++) {
      // check if we are supposed to proceed our line
      if (this.process[i]) {
        break;
      } else {
        // check for comment-only on our line
        if (COMMENT_ONLY_TEST.test(this.split[i])) {
          const match = COMMENT.match.exec(this.split[i]);
          if (match !== null) {
            const basic: IBasicToken<CommentToken> = {
              type: TOKEN_TYPES.BASIC,
              name: TOKEN_NAMES.COMMENT,
              pos: [i, match.index, match[0].length],
              matches: GetMatchesArray<CommentToken>(match),
            };
            this.foundToken(basic);
          } else {
            break;
          }
        }
      }
    }

    // return if nothing to finish
    if (i >= this.split.length) {
      this.done = true;
      return false;
    }

    // update properties
    this.current.line = i;
    this.current.continued = isContinuedLine;
    this.current.lineText = this.split[this.current.line];
    this.current.sub = this.current.lineText;
    this.current.linePosition = 0;
    this.current.foundTypes = {};
    this.current.skipToNextLine = false;

    // skip white space
    this._skipOverSpaces();

    // return true, indicating that we need to keep iterating
    return true;
  }
}
