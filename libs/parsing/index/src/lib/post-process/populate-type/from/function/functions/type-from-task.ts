import {
  FindAllBranchChildren,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { CallFunctionToken, TOKEN_NAMES } from '@idl/tokenizer';
import { IDL_TYPE_LOOKUP } from '@idl/types/core';
import { basename } from 'path';

import { IDLIndex } from '../../../../../idl-index.class';
import { EvaluateToken } from '../../../evaluate/evaluate-token';
import { EvaluateVariableOrToken } from '../../helpers/evaluate-variable-or-token';

/**
 * Attempt to determine the type of task that we are working with
 *
 */
export function TypeFromTask(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken>,
  type: 'ENVI' | 'IDL' = 'ENVI'
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
      taskName = EvaluateVariableOrToken(index, parsed, kids[0]);
      if (taskName === IDL_TYPE_LOOKUP.ANY) {
        taskName = undefined;
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

        if (!text) {
          taskName = '';
          break;
        }

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
