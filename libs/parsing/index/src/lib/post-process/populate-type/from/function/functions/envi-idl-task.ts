import {
  FindAllBranchChildren,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { CallFunctionToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { basename } from 'path';

import { IDLIndex } from '../../../../../idl-index.class';
import { EvaluateToken } from '../../../evaluate/evaluate-token';
import { TypeFromVariable } from '../../type-from-variable';

/**
 * Attempt to determine the type of task that we are working with
 *
 */
export function FromENVIOrIDLTask(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken>,
  type = 'ENVI'
): string {
  /**
   * Get the kids from our function call
   */
  const kids = token.kids;

  /** Init task name of task */
  let taskName: string;

  /**
   * Determine how to proceed
   */
  switch (kids.length) {
    case 1: {
      /**
       * Get our first child
       */
      const kid = kids[0];

      // check what our kid is
      switch (kid.name) {
        case TOKEN_NAMES.VARIABLE:
          taskName = TypeFromVariable(index, parsed, kid)[0].value;
          break;
        default:
          taskName = EvaluateToken(kids[0]);
          break;
      }
      break;
    }
    default: {
      /**
       * Find any strings to make some guesses
       */
      const matches = FindAllBranchChildren(token, [
        TOKEN_NAMES.QUOTE_DOUBLE,
        TOKEN_NAMES.QUOTE_SINGLE,
        TOKEN_NAMES.STRING_TEMPLATE_LITERAL,
      ]).reverse();

      // process all strings
      for (let i = 0; i < matches.length; i++) {
        // get value of text
        const text = EvaluateToken(matches[i]);

        //  based on type,
        if (text.toLowerCase().includes('.task')) {
          taskName = text;
          break;
        }
      }
      break;
    }
  }

  /**
   * Do we have a task name?
   */
  if (taskName !== undefined) {
    return `${type}${basename(taskName).replace(/\.task/i, '')}Task`;
  } else {
    // if not, resort to function call/base class
    return `${type}Task`;
  }
}
