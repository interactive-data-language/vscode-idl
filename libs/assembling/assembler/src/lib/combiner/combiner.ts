import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import {
  BRANCH_TYPES,
  IBranch,
  IParsed,
  MakeSpaces,
  SyntaxTree,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  NonBasicTokenNames,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';

import { GetNewLine } from '../helpers/get-new-line';
import { Stringify } from '../helpers/stringify';
import {
  ICombinerRecursionOptions,
  IStringsByLine,
} from './combiner.interface';
import {
  DONT_RESET_INDENTS_ON_CLOSE,
  IGNORE_LINE_CONTINUATION_INDENTS,
  INDENT_OFFSET_TOKENS,
  LINE_CONTINUATION_RESETS,
  LINE_INCREMENT_ON_CLOSE,
  LINE_INCREMENTERS_ON_DETECT,
  REMOVE_LINE_CONTINUATION_INDENTS_ON_OPEN,
  SKIP_FORMATTING_TOKEN_STARTS,
  SKIP_TOKEN_FORMATTING,
  TOKEN_INDENT_DECREASE_AFTER,
  TOKEN_INDENT_INCREASERS,
} from './controls.interface';

/**
 * Routine that recurses and manages converting our code to strings
 */
function _Recursor<T extends FormatterType>(
  tree: SyntaxTree,
  options: IAssemblerOptions<T>,
  recurse: ICombinerRecursionOptions,
  strings: IStringsByLine
) {
  /** String for current line */
  let line = GetNewLine(
    recurse.indentLevel,
    options.tabWidth,
    recurse.tokenParent
  );

  /** Store the last line from our tokens */
  let lastLine = -1;

  /** Line for our current token */
  let tokenLine = -1;

  // process all tokens
  for (let i = 0; i < tree.length; i++) {
    // check if we need to increment our line offset
    if (tree[i].name in LINE_INCREMENTERS_ON_DETECT) {
      recurse.lineOffset += 1;
    }

    // track the line for our current token
    tokenLine = tree[i].pos[0] + recurse.lineOffset;

    // check if we have a line continuation and should increase our indentation
    if (
      tree[i].name === TOKEN_NAMES.LINE_CONTINUATION &&
      !recurse.ignoreLineContinuation
    ) {
      // increase indent if we didnt have a previous line continuation
      if (!recurse.lineContinuation) {
        recurse.indentLevel += 1;
      }
      recurse.lineContinuation = true;
    }

    // check if we need to remove line continuations before key statements
    // this is to handle weird formatting with line continuations in case and
    // switch statements to the logic and start left-align
    if (
      tree[i].name in REMOVE_LINE_CONTINUATION_INDENTS_ON_OPEN &&
      recurse.lineContinuation
    ) {
      recurse.lineContinuation = false;
      recurse.indentLevel -= 1;
    }

    // if first token we are processing, save the starting line
    // and check if we have an existing line to append our strings to
    if (i === 0) {
      lastLine = tokenLine;

      // did we already process our line and should we extract the strings we have
      if (lastLine in strings) {
        line = strings[lastLine];
      } else {
        strings[lastLine] = line;
      }
    }

    // check if we are on a new line and need to close our last one
    if (
      tokenLine !== lastLine &&
      !(tree[i].name in LINE_INCREMENTERS_ON_DETECT)
    ) {
      lastLine = tokenLine;

      // did we already process our line and should we extract the strings we have
      if (lastLine in strings) {
        line = strings[lastLine];
      } else {
        line = GetNewLine(
          recurse.indentLevel,
          options.tabWidth,
          recurse.tokenParent
        );
        strings[lastLine] = line;
      }
    }

    // save the start of the current match
    if (
      !(tree[i].name in SKIP_TOKEN_FORMATTING) &&
      !(tree[i].name in SKIP_FORMATTING_TOKEN_STARTS)
    ) {
      line.push(Stringify(tree[i], recurse.tokenBefore, line.length < 2));
    }

    // check branch type
    if (tree[i].type !== BRANCH_TYPES.BRANCH) {
      recurse.tokenBefore = tree[i];
    } else {
      // extract a branch and use var so we have separate type
      const branch = tree[i] as IBranch<NonBasicTokenNames>;

      // save information before recursion
      let preIndent = recurse.indentLevel;
      const preContinuation = recurse.lineContinuation;
      const preContinuationIgnore = recurse.ignoreLineContinuation;
      const preComment = recurse.commentBlock;
      const preParent = recurse.tokenParent;

      // check if we need to reset our line continuation flag or not
      // because we have an additional level of indentation
      if (recurse.lineContinuation) {
        recurse.lineContinuation = !(tree[i].name in LINE_CONTINUATION_RESETS);
      }

      // do we need to bump our indent based on the token type
      if (tree[i].name in TOKEN_INDENT_INCREASERS) {
        recurse.indentLevel += 1;
      }

      // set ignore line continuation
      recurse.ignoreLineContinuation =
        tree[i].name in IGNORE_LINE_CONTINUATION_INDENTS;

      // set flag if we are in a comment block
      recurse.commentBlock = tree[i].name === TOKEN_NAMES.COMMENT_BLOCK;

      // save token name
      recurse.tokenBefore = branch as TreeToken<TokenName>;
      recurse.tokenParent = branch as TreeToken<TokenName>;

      // process our children
      _Recursor(branch.kids, options, recurse, strings);

      // check if we have an offset for the indent when closing our block
      // the offset comes from sometimes needing to preserve the indent from
      // continuations (i.e. arrays, functions, procedures, structures) or
      // we dont want to preserve the continuations (i.e. block statements)
      const indentOffset = tree[i].name in INDENT_OFFSET_TOKENS ? 1 : 0;

      // properly close our token if not comment block
      if (
        branch?.end !== undefined &&
        !(tree[i].name in SKIP_TOKEN_FORMATTING) &&
        branch.end.pos[2] !== 0
      ) {
        // get the line that we close on
        const closeLine = branch.end.pos[0] + recurse.lineOffset;

        // make sure there is something to add
        const toAdd = branch.end.match[0];

        // check if it exists already
        if (closeLine in strings) {
          // get lines for the close
          let closeAdd = strings[closeLine];

          // make sure we have something to close
          if (toAdd !== '') {
            // check if we have elements or not
            if (closeAdd.length === 0) {
              // if fresh line, add brand ned line
              closeAdd = GetNewLine(
                recurse.indentLevel - indentOffset,
                options.tabWidth,
                recurse.tokenParent
              );
              closeAdd.push(toAdd);
              // closeAdd.push(toAdd);
              strings[closeLine] = closeAdd;
            } else {
              // if existing strings, concat to last entry to avoid excess strings
              closeAdd[closeAdd.length - 1] += toAdd;
            }
          }
        } else {
          line = GetNewLine(
            recurse.indentLevel - indentOffset,
            options.tabWidth,
            recurse.tokenParent
          );
          line.push(toAdd);
          strings[closeLine] = line;
        }
      }

      // check if we need to increment our line offset
      if (tree[i].name in LINE_INCREMENT_ON_CLOSE) {
        recurse.lineOffset += 1;
      }

      // check if we need to reduce our indent level
      // this handles where a case statement may have line continuations
      // and then another case/switch where we need to bring our indent back in
      if (
        tree[i].name in TOKEN_INDENT_DECREASE_AFTER &&
        recurse.lineContinuation
      ) {
        preIndent -= 1;
      }

      // reset indent level
      if (!(tree[i].name in DONT_RESET_INDENTS_ON_CLOSE)) {
        recurse.indentLevel = preIndent;
      }

      // reset other properties
      recurse.lineContinuation = preContinuation;
      recurse.ignoreLineContinuation = preContinuationIgnore;
      recurse.commentBlock = preComment;
      recurse.tokenParent = preParent;

      // reset token before as our branch is closed and no longer before
      recurse.tokenBefore = undefined;
    }
  }
}

/**
 * Combines code that has had styling and basic formatting applied
 *
 * This creates our "mechanical" structure of the code
 */
export function Combiner<T extends FormatterType>(
  tokenized: IParsed,
  options: IAssemblerOptions<T>
): string[] {
  // initialize strings by line
  const byLine: IStringsByLine = {};

  // create our recursion options
  const recursion: ICombinerRecursionOptions = {
    indentLevel: 0,
    lineContinuation: false,
    ignoreLineContinuation: false,
    commentBlock: false,
    lineOffset: 0,
    tokenBefore: undefined,
    tokenParent: undefined,
  };

  // convert tokens back to strings
  _Recursor(tokenized.tree, options, recursion, byLine);

  // combine to strings
  const strings: string[] = [];

  // get all of our lines
  const lines = Object.keys(byLine);

  /** Last line we created text for */
  let lastLine = lines.length > 0 ? +lines[0] : 0;

  // process all of our lines
  for (let i = 0; i < lines.length; i++) {
    // get line number
    const line = +lines[i];

    // check if we need to add a spacer line
    if (i > 0) {
      if (line - lastLine > 1) {
        strings.push('');
      }
    }

    // add our content string together
    const merged = byLine[line].join('');

    // verify we have content
    if (merged !== '') {
      strings.push(
        `${MakeSpaces(
          options.spaceOffset !== undefined ? options.spaceOffset : 0
        )}${merged}`
      );

      // save the last line
      lastLine = line;
    }
  }

  return strings;
}
