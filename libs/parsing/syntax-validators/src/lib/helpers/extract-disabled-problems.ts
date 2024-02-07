import {
  IParsed,
  SyntaxProblemWithoutTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  CommentToken,
  NonBasicTokenNames,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  DISABLED_PROBLEM_FLAGS,
  DISABLED_PROBLEM_REGEX,
  IDL_PROBLEM_CODES,
  IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP,
} from '@idl/types/problem-codes';

/**
 * Extracts disabled problems from a comment token
 */
export function ExtractDisabledProblems(
  comment: string,
  token: TreeToken<CommentToken>,
  parsed: IParsed,
  local?: TreeToken<NonBasicTokenNames>
) {
  /** Test our string */
  const match = DISABLED_PROBLEM_REGEX.exec(comment);

  // check if we have a match
  if (match !== null) {
    /** Get disabled flag */
    const flag = match[1].toLowerCase();

    /**
     * Get arguments that we need to process
     */
    const args: string[] = match[2]
      ? match[2]
          .toLowerCase()
          .split(/,/g)
          .map((alias) => alias.trim())
          .filter((alias) => alias !== '')
      : [];

    /** map arguments to codes */
    const codes = args
      .filter((alias) => {
        // make sure valid alias
        if (!(alias in IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP)) {
          parsed.parseProblems.push(
            SyntaxProblemWithoutTranslation(
              IDL_PROBLEM_CODES.UNKNOWN_DISABLED_ALIAS,
              `${
                IDL_TRANSLATION.parsing.errors[
                  IDL_PROBLEM_CODES.UNKNOWN_DISABLED_ALIAS
                ]
              } "${alias}"`,
              token.pos,
              token.pos
            )
          );
          return false;
        }
        return true;
      })
      .map((alias) => IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP[alias]);

    // determine how to proceed
    switch (flag) {
      /**
       * Disable all problems for a file
       */
      case DISABLED_PROBLEM_FLAGS.ALL:
        // disable all problems if no args
        if (args.length === 0) {
          parsed.disabledProblems.all = true;
        } else {
          // save all problems as disabled
          for (let i = 0; i < codes.length; i++) {
            parsed.disabledProblems.forFile[codes[i]] = true;
          }
        }
        break;

      /**
       * Disable all codes for the line we are on
       */
      case DISABLED_PROBLEM_FLAGS.LINE:
        // add data struct if it exists
        if (!(token.pos[0] in parsed.disabledProblems.forLines)) {
          parsed.disabledProblems.forLines[token.pos[0]] = {};
        }

        // save all problems as disabled for this line
        for (let i = 0; i < codes.length; i++) {
          parsed.disabledProblems.forLines[token.pos[0]][codes[i]] = true;
        }
        break;

      /**
       * Disable all codes for the next line
       */
      case DISABLED_PROBLEM_FLAGS.NEXT: {
        /** Get the line to report as disabled */
        let line = token.pos[0] + 1;

        // check if our local parent is a comment block and we need the end of it
        if (local?.name === TOKEN_NAMES.COMMENT_BLOCK) {
          line = (local?.end?.pos || token.pos)[0] + 1;
        }

        // add data struct if it exists
        if (!(token.pos[0] in parsed.disabledProblems.forLines)) {
          parsed.disabledProblems.forLines[line] = {};
        }

        // save all problems as disabled for this line
        for (let i = 0; i < codes.length; i++) {
          parsed.disabledProblems.forLines[line][codes[i]] = true;
        }
        break;
      }
      default:
        break;
    }
  }
}
