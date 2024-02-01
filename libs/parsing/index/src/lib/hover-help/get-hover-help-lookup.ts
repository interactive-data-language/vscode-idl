import { CancellationToken } from '@idl/cancellation-tokens';
import { GetTokenAtCursor, TreeToken } from '@idl/parsing/syntax-tree';
import {
  KeywordBinaryToken,
  KeywordDefinitionToken,
  KeywordToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { GetHoverHelpLookupResponse } from '@idl/workers/parsing';
import { Position } from 'vscode-languageserver';

import { CALL_ROUTINE_TOKENS } from '../helpers/get-keywords.interface';
import { GetRoutine } from '../helpers/get-routine';
import { IDLIndex } from '../idl-index.class';
import {
  CONTROL_HELPERS,
  GetControlHoverHelp,
} from './hover-help-for/get-control-hover-help';
import { GetKeywordHoverHelp } from './hover-help-for/get-keyword-hover-help';
import { GetOverrideHoverHelp } from './hover-help-for/get-override-hover-help';
import { GetPropertyHoverHelp } from './hover-help-for/get-property-hover-help';
import { GetVarHoverHelp } from './hover-help-for/get-var-hover-help';

/** Allowed local parents for attempting to find keyword definition information */
const KW_DEF: { [key: string]: boolean } = {};
KW_DEF[TOKEN_NAMES.ROUTINE_NAME] = true;
KW_DEF[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Returns text for hover help
 */
export async function GetHoverHelpLookup(
  index: IDLIndex,
  file: string,
  code: string | string[],
  position: Position
): Promise<GetHoverHelpLookupResponse> {
  /**
   * Init response
   */
  const lookup: GetHoverHelpLookupResponse = {
    pos: [0, 0, 0],
  };

  // get the tokens for our file
  const parsed = await index.getParsedProCode(
    file,
    code,
    new CancellationToken(),
    {
      postProcess: true,
    }
  );
  if (parsed !== undefined) {
    // determine what we have hovered over
    const hovered = GetTokenAtCursor(parsed, position, true);

    // unpack for easier access
    const token = hovered.token;
    const parent = hovered.globalParent;
    const local = hovered.localParent;

    // check if we found a token
    if (token !== undefined) {
      // update position
      lookup.pos = token.pos;

      // check if we have override hover help
      const override = GetOverrideHoverHelp(token, position);

      // check return value
      if (override !== '') {
        lookup.contents = override;
        return lookup;
      }

      // check for control statements
      if (token.name in CONTROL_HELPERS) {
        lookup.contents = GetControlHoverHelp(token);
        return lookup;
      }

      // check what we have selected and act accordingly
      switch (token.name) {
        // keyword within the routine name branch, part of function or procedure definition
        case TOKEN_NAMES.KEYWORD_DEFINITION:
        case TOKEN_NAMES.KEYWORD: {
          GetKeywordHoverHelp(
            index,
            parsed,
            token as TreeToken<KeywordToken | KeywordDefinitionToken>,
            lookup
          );
          break;
        }
        // when calling routine, syntax of the form `/KEYWORD`
        // special case for handling the syntax
        case TOKEN_NAMES.KEYWORD_BINARY: {
          // check if we have a local variable
          if (local !== undefined) {
            // verify we have a valid parent (extra check, should always be the case with post-processing)
            if (local.name in CALL_ROUTINE_TOKENS) {
              GetKeywordHoverHelp(
                index,
                parsed,
                token as TreeToken<KeywordBinaryToken>,
                lookup
              );
            }
          }
          break;
        }

        // help when we hover over a routine that a user has defined, right after pro or function
        case TOKEN_NAMES.CALL_PROCEDURE_METHOD:
        case TOKEN_NAMES.CALL_PROCEDURE:
        case TOKEN_NAMES.CALL_FUNCTION_METHOD:
        case TOKEN_NAMES.CALL_FUNCTION:
        case TOKEN_NAMES.ROUTINE_NAME:
        case TOKEN_NAMES.ROUTINE_METHOD_NAME: {
          const global = GetRoutine(index, parsed, token, false);
          if (global.length > 0) {
            lookup.type = global[0].type;
            lookup.name = global[0].name;
          }
          break;
        }
        case TOKEN_NAMES.ARG_DEFINITION:
        case TOKEN_NAMES.VARIABLE: {
          lookup.contents = GetVarHoverHelp(parsed, token, parent);
          break;
        }
        case TOKEN_NAMES.ACCESS_PROPERTY:
        case TOKEN_NAMES.STRUCTURE_PROPERTY: {
          GetPropertyHoverHelp(index, parsed, token, lookup);
          break;
        }
        case TOKEN_NAMES.SYSTEM_VARIABLE: {
          lookup.type = GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE;
          lookup.name = token.match[0].toLowerCase();
          break;
        }
        default:
          break;
      }
    }
  }

  return lookup;
}
