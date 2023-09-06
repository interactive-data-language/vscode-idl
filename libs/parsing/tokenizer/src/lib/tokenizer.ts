import { CancellationToken } from '@idl/cancellation-tokens';
import { nanoid } from 'nanoid';

import { FindMatches } from './helpers/find-matches';
import { GetFirstMatch } from './helpers/get-first-match';
import { IGetFirstMatch } from './helpers/get-first-match.interface';
import { GetMatchesArray } from './helpers/get-matches-array';
import { Iterator } from './iterator.class';
import {
  CLOSE_PARENTS_ON_CLOSE,
  DEFAULT_FIND_TOKEN_OPTIONS,
  IBasicToken,
  IEndToken,
  IFindTokensOptions,
  IFoundTokens,
  IStartToken,
  NO_AUTO_CLOSE,
  TOKEN_TYPES,
} from './tokenizer.interface';
import { ITokenDef, TokenName } from './tokens.interface';
import { IDL_LINE_END } from './tokens/regex.interface';
import { GetSubDefs } from './tokens/sub-defs';

/**
 * Converts code into a token representation and uses recursion
 * to find nested tokens.
 *
 * At a high level this function:
 *
 * 1. Takes an iterator which manages the code and location we are
 *    currently processing.
 * 2. Searches for matching tokens and finds the first match closest
 *    to the start of our string.
 * 3. If our found token expects a separate token to close, then we
 *    recurse and try to find.
 * 4. On recursion, we use a subset of our tokens, if configured, to
 *    limit what we try to match. For example: Don't search a string
 *    or comments for anything besides a closing string or end of line.
 *
 * Rinse and repeat for each line of code and then we return our results.
 */
export function TokenizerRecurser(
  iterator: Iterator,
  options: IFindTokensOptions
) {
  // get the number of lines
  const n = iterator.split.length;

  // return if nothing to process
  if (n === 0) {
    return;
  }

  /** Current location of our iteration, updated internally, always same object */
  const current = iterator.current;

  /** Do we have something we are trying to close */
  const hasCloser = options.closer !== undefined;

  /** All definitions we have found */
  const foundDefs: ITokenDef<TokenName>[] = [];

  /** All regex matches */
  const matches: RegExpExecArray[] = [];

  /** For all regex matches, which match is the first */
  let firstMatch: IGetFirstMatch;

  /** Flag for our while loop indicating how long to process */
  let process = true;

  /** Flag if our current line has a line continuation at the end */
  let hasLineContinuation = false;

  // iterate over all our code
  while (process) {
    // check if we are finished with our line and have no closer to search for
    if (!current.sub && !hasCloser) {
      break;
    }

    // check for line continuation
    hasLineContinuation = !IDL_LINE_END.test(current.sub);

    // // debug information
    // console.log(
    //   current.line,
    //   JSON.stringify(current.sub),
    //   current.recursionLevel,
    //   useOptions.defs.length
    // );

    // find matches for the text on our line
    FindMatches(
      current.lineText,
      current.sub,
      current.linePosition,
      foundDefs,
      matches,
      options.defs
    );

    // recursively process the string
    while (matches.length > 0) {
      // check all of our matches to find the first one
      firstMatch = GetFirstMatch(current.sub, matches, options.closer);

      // check if we found a closer
      if (firstMatch.closer !== undefined) {
        // remove last token from parents
        current.parents.pop();

        // initialize our return value, strictly typed, and return
        const ended: IEndToken<TokenName> = {
          type: TOKEN_TYPES.END,
          name: options._closerTokenName
            ? options._closerTokenName
            : options.closer.name,
          pos: iterator.positionArray(firstMatch.closer),
          matches: GetMatchesArray(firstMatch.closer),
          _id: options._closerId || nanoid(),
        };

        // save our token
        iterator.foundToken(ended);

        // move our iterator through our string
        iterator.shiftByMatch(firstMatch.closer);

        // update our flag to shift to the next line
        if (options.closer.nextLineOnClose) {
          current.skipToNextLine = true;
        }

        // dont continue, return since we found or missing pair if we are recursing
        return;
      }

      // check if we found something
      if (firstMatch.idxFirst !== -1) {
        // extract some useful information
        const _id = nanoid();
        const lastFound = foundDefs[firstMatch.idxFirst];
        const match = matches[firstMatch.idxFirst];
        const position = iterator.positionArray(match);

        // get matches and token type
        const useMatches = GetMatchesArray(match);
        const tokenName =
          lastFound.getTokenName !== undefined
            ? lastFound.getTokenName(useMatches)
            : lastFound.name;

        // check if we need to update our matches with post-processing
        const saveMatches =
          lastFound.postProcessMatches !== undefined
            ? lastFound.postProcessMatches(tokenName, useMatches)
            : useMatches;

        // check if we need to save our parent
        if (lastFound.end !== undefined) {
          // set flag for preserving space
          current.parents.push(tokenName);
        }

        // move our iterator through our string
        iterator.shiftByMatch(match);

        // determine how to proceed with our token
        switch (true) {
          case lastFound.end === undefined:
            // do we have a basic token?
            {
              const basic: IBasicToken<TokenName> = {
                type: TOKEN_TYPES.BASIC,
                name: tokenName,
                pos: position,
                matches: saveMatches,
              };
              iterator.foundToken(basic);
            }
            break;
          default:
            // default case is our token has an end to look for
            {
              // initialize our return value, strictly typed, and return
              const started: IStartToken<TokenName> = {
                type: TOKEN_TYPES.START,
                name: tokenName,
                pos: position,
                matches: saveMatches,
                _id,
              };
              iterator.foundToken(started);

              // process our children - and account for recursion level
              current.recursionLevel++;
              TokenizerRecurser(iterator, {
                closer: lastFound,
                _closerId: _id,
                _closerTokenName: tokenName,
                defs: GetSubDefs(tokenName, options.subDefs),
                subDefs: options.subDefs,
                default: options.default,
                full: options.full,
              });
              current.recursionLevel--;

              // flag if we closed a token we recursed for
              const lastToken = iterator.tokens[iterator.tokens.length - 1];
              const tokenClosed =
                lastToken.name === tokenName &&
                (lastToken as IEndToken<TokenName>)._id === _id;

              // check if we need to reset our tokens
              if (tokenClosed) {
                // check if we need to adjust the tokens we are searching for
                if (lastFound.defaultTokens) {
                  options.defs = options.default;
                }

                // check if we are finished with our line and have no closer to search for
                if (!current.sub && !hasCloser) {
                  current.skipToNextLine = true;
                }

                // check if we have a token to add after our token was closed
                if (hasCloser) {
                  // get the name of our closer
                  const useCloserName = options._closerTokenName
                    ? options._closerTokenName
                    : options.closer.name;

                  // check if we should force close
                  const forceClose =
                    !(useCloserName in NO_AUTO_CLOSE) &&
                    tokenName in CLOSE_PARENTS_ON_CLOSE;

                  // verify if we are good to force close
                  if (
                    useCloserName === lastFound.closeParentTokenAfterEnd ||
                    forceClose
                  ) {
                    // remove last token from parents
                    current.parents.pop();

                    // check if we can close what we are recursing for
                    // initialize our return value, strictly typed, and return
                    const ended: IEndToken<TokenName> = {
                      type: TOKEN_TYPES.END,
                      name: useCloserName,
                      pos: iterator.positionArray(),
                      matches: [``],
                      _id: options._closerId || nanoid(),
                    };

                    // save our token
                    iterator.foundToken(ended);

                    // update our flag to shift to the next line
                    if (options.closer.nextLineOnClose) {
                      current.skipToNextLine = true;
                    }

                    // dont continue, return since we found or missing pair if we are recursing
                    return;
                  }
                }
              }
            }
            break;
        }

        // stop processing if we are supposed to skip the rest of our line
        // this is set upon recursion after the `FindTokens` call just above
        if (iterator.done || current.skipToNextLine) {
          break;
        }
      }

      // check if we are finished with our line and have no closer to search for
      if (!current.sub && !hasCloser) {
        break;
      }

      // find other matches
      FindMatches(
        current.lineText,
        current.sub,
        current.linePosition,
        foundDefs,
        matches,
        options.defs
      );

      // // debug information
      // console.log(
      //   current.line,
      //   JSON.stringify(current.sub),
      //   current.recursionLevel
      // );
      // console.log(matches);
      // console.log(useOptions.defs);
    }

    // end if done
    if (iterator.done) {
      break;
    }

    // check for closer before giving up
    if (hasCloser && !current.skipToNextLine) {
      firstMatch = GetFirstMatch(current.sub, matches, options.closer);
      if (firstMatch.closer !== undefined) {
        // remove last token from parents
        current.parents.pop();

        // initialize our return value, strictly typed, and return
        const ended: IEndToken<TokenName> = {
          type: TOKEN_TYPES.END,
          name: options._closerTokenName
            ? options._closerTokenName
            : options.closer.name,
          pos: iterator.positionArray(firstMatch.closer),
          matches: GetMatchesArray(firstMatch.closer),
          _id: options._closerId || nanoid(),
        };

        // add our token
        iterator.foundToken(ended);

        // move our iterator through our string
        iterator.shiftByMatch(firstMatch.closer);

        // update our flag to shift to the next line
        if (options.closer.nextLineOnClose) {
          current.skipToNextLine = true;
        }

        // dont continue, return since we found or missing pair if we are recursing
        return;
      }
    }

    // go to the next line
    process = iterator.nextLine(hasLineContinuation);

    // reset defs if done with line
    if (process && !hasLineContinuation) {
      current.foundTypes = {};
    }
  }

  return;
}

/**
 * Extracts tokens from our code
 */
export function Tokenizer(
  code: string | string[],
  cancel: CancellationToken,
  options: IFindTokensOptions = DEFAULT_FIND_TOKEN_OPTIONS
): IFoundTokens {
  // create our iterator
  const iterator = new Iterator(code, cancel, options.full);

  // find our tokens if we can
  if (iterator.canProcess) {
    TokenizerRecurser(iterator, options);
  }

  return {
    tokens: iterator.tokens,
    text: iterator.split,
    lines: iterator.split.length,
  };
}
