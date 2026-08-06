import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { TreeRecurserBasic } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/tokenizer';

import {
  DISALLOWED_FUNCTIONS,
  DISALLOWED_PROCEDURES,
  DISALLOWED_TOKENS,
} from './validate-idl-code.interface';

/**
 * Verifies that we have a single command and does some sanity checks
 * for security about what routines execute
 */
export function ValidateIDLCode(command: string) {
  /** Make a cancellation token */
  const cancel = new CancellationToken();

  /** Parse */
  const parsed = Parser(command, cancel);

  let valid = true;

  /** Message if we have an error */
  let reason: string | undefined;

  /**
   * Recurse through the code and do some sanity checks
   */
  TreeRecurserBasic(parsed.tree, cancel, {
    onBasicToken: (token) => {
      // check for invalid tokens
      if (token.name in DISALLOWED_TOKENS) {
        valid = false;
        reason = DISALLOWED_TOKENS[token.name];
        return true;
      }
    },
    onBranchToken: (token) => {
      // check for invalid tokens
      if (token.name in DISALLOWED_TOKENS) {
        valid = false;
        reason = DISALLOWED_TOKENS[token.name];
        return true;
      }

      /**
       * Check functions and procedures against bad names
       */
      switch (token.name) {
        // check for bad functions
        case TOKEN_NAMES.CALL_FUNCTION: {
          const name = token.match[1].toLowerCase();
          if (name in DISALLOWED_FUNCTIONS) {
            valid = false;
            reason = `Function "${name}" is not allowed for security reasons`;
            return true;
          }
          break;
        }

        // check for bad procedures
        case TOKEN_NAMES.CALL_PROCEDURE: {
          const name = token.match[0].toLowerCase();
          if (name in DISALLOWED_PROCEDURES) {
            valid = false;
            reason = `Procedure "${name}" is not allowed for security reasons`;
            return true;
          }
          break;
        }
        default:
          break;
      }
    },
  });

  return { valid, reason };
}
