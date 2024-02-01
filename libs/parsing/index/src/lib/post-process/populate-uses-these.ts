import { CancellationToken } from '@idl/cancellation-tokens';
import {
  FindDirectBranchChildren,
  IParsed,
  PopulateScopeDetail,
  TreeRecurserBasic,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

import { GetMethod } from '../helpers/get-method';
import { IDLIndex } from '../idl-index.class';

/**
 * Populates the external routines that we call
 *
 * We do this AFTER we populate types because we need to have
 * type detail for methods
 */
export function PopulateUsesThese(
  index: IDLIndex,
  parsed: IParsed,
  cancel: CancellationToken
) {
  // populate scope detail
  PopulateScopeDetail(parsed, cancel);

  TreeRecurserBasic(parsed.tree, cancel, {
    onBasicToken: (token) => {
      switch (token.name) {
        case TOKEN_NAMES.SYSTEM_VARIABLE:
          parsed.uses[GLOBAL_TOKEN_TYPES.FUNCTION][
            token.match[0].toLowerCase()
          ] = true;
          break;
        default:
          break;
      }
    },
    onBranchToken: (token) => {
      switch (token.name) {
        case TOKEN_NAMES.CALL_FUNCTION:
          parsed.uses[GLOBAL_TOKEN_TYPES.FUNCTION][
            token.match[1].toLowerCase()
          ] = true;
          break;
        case TOKEN_NAMES.CALL_PROCEDURE:
          parsed.uses[GLOBAL_TOKEN_TYPES.PROCEDURE][
            token.match[0].toLowerCase()
          ] = true;
          break;
        case TOKEN_NAMES.CALL_FUNCTION_METHOD:
          {
            const methods = GetMethod(index, parsed, token);
            if (methods.length > 0) {
              parsed.uses[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD][methods[0].name] =
                true;
            }
          }
          break;
        case TOKEN_NAMES.CALL_PROCEDURE_METHOD:
          {
            const methods = GetMethod(index, parsed, token);
            if (methods.length > 0) {
              parsed.uses[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD][
                methods[0].name
              ] = true;
            }
          }
          break;
        case TOKEN_NAMES.STRUCTURE: {
          const names = FindDirectBranchChildren(
            token,
            TOKEN_NAMES.STRUCTURE_NAME
          );
          if (names.length > 0) {
            parsed.uses[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD][
              names[0].match[0].toLowerCase()
            ] = true;
          }
          break;
        }
        default:
          break;
      }
    },
  });
}
