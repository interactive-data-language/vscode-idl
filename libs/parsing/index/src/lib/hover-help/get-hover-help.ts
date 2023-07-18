import { GetTokenAtCursor, IBasicBranch } from '@idl/parsing/syntax-tree';
import {
  KeywordBinaryToken,
  KeywordDefinitionToken,
  KeywordToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { Hover, Position } from 'vscode-languageserver';

import { CALL_ROUTINE_TOKENS } from '../helpers/get-keywords.interface';
import { ResolveHoverHelpLinks } from '../helpers/resolve-hover-help-links';
import { IDLIndex } from '../idl-index.class';
import {
  CONTROL_HELPERS,
  GetControlHoverHelp,
} from './hover-help-for/get-control-hover-help';
import { GetKeywordHoverHelp } from './hover-help-for/get-keyword-hover-help';
import { GetOverrideHoverHelp } from './hover-help-for/get-override-hover-help';
import { GetPropertyHoverHelp } from './hover-help-for/get-property-hover-help';
import { GetRoutineHoverHelp } from './hover-help-for/get-routine-hover-help';
import { GetSysVarHoverHelp } from './hover-help-for/get-sysvar-hover-help';
import { GetVarHoverHelp } from './hover-help-for/get-var-hover-help';

/** Allowed local parents for attempting to find keyword definition information */
const KW_DEF: { [key: string]: boolean } = {};
KW_DEF[TOKEN_NAMES.ROUTINE_NAME] = true;
KW_DEF[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Returns text for hover help
 */
export async function GetHoverHelp(
  index: IDLIndex,
  file: string,
  code: string | string[],
  position: Position,
  config: IDLExtensionConfig
): Promise<Hover> {
  // get the tokens for our file
  const parsed = await index.getParsedProCode(file, code, {
    postProcess: true,
  });
  if (parsed !== undefined) {
    // determine what we have hovered over
    const hovered = GetTokenAtCursor(parsed, position, true);

    // unpack for easier access
    const token = hovered.token;
    const parent = hovered.globalParent;
    const local = hovered.localParent;

    // check if we found a token
    if (token !== undefined) {
      // check if we have override hover help
      const override = GetOverrideHoverHelp(token, position);

      // initialize the value of our help
      let help = '';

      // init hover response
      const hover: Hover = {
        contents: '',
        range: {
          start: {
            line: token.pos[0],
            character: token.pos[1],
          },
          end: {
            line: token.pos[0],
            character: token.pos[1] + token.pos[2],
          },
        },
      };

      // check return value
      if (override !== '') {
        hover.contents = override;
        return hover;
      }

      // check for control statements
      if (token.name in CONTROL_HELPERS) {
        hover.contents = GetControlHoverHelp(token);
        return hover;
      }

      // check what we have selected and act accordingly
      switch (token.name) {
        // keyword within the routine name branch, part of function or procedure definition
        case TOKEN_NAMES.KEYWORD_DEFINITION: {
          help = GetKeywordHoverHelp(
            index,
            parsed,
            token as IBasicBranch<KeywordDefinitionToken>
          );
          break;
        }
        // when calling routine, syntax of the form `KEYWORD = `
        case TOKEN_NAMES.KEYWORD: {
          help = GetKeywordHoverHelp(
            index,
            parsed,
            token as IBasicBranch<KeywordToken>
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
              help = GetKeywordHoverHelp(
                index,
                parsed,
                token as IBasicBranch<KeywordBinaryToken>
              );
            }
          }
          break;
        }
        case TOKEN_NAMES.ROUTINE_NAME: {
          help = GetRoutineHoverHelp(index, parsed, token);
          break;
        }
        // help when we hover over a routine that a user has defined, right after pro or function
        case TOKEN_NAMES.ROUTINE_METHOD_NAME: {
          help = GetRoutineHoverHelp(index, parsed, token);
          break;
        }
        case TOKEN_NAMES.CALL_FUNCTION:
          help = GetRoutineHoverHelp(index, parsed, token);
          break;
        case TOKEN_NAMES.CALL_FUNCTION_METHOD:
          help = GetRoutineHoverHelp(index, parsed, token);
          break;
        case TOKEN_NAMES.CALL_PROCEDURE:
          help = GetRoutineHoverHelp(index, parsed, token);
          break;
        case TOKEN_NAMES.CALL_PROCEDURE_METHOD:
          help = GetRoutineHoverHelp(index, parsed, token);
          break;
        case TOKEN_NAMES.ARG_DEFINITION: {
          help = GetVarHoverHelp(parsed, token, parent);
          break;
        }
        case TOKEN_NAMES.VARIABLE: {
          help = GetVarHoverHelp(parsed, token, parent);
          break;
        }
        case TOKEN_NAMES.ACCESS_PROPERTY: {
          help = GetPropertyHoverHelp(index, parsed, token);
          break;
        }
        // when calling routine, syntax of the form `KEYWORD = `
        case TOKEN_NAMES.STRUCTURE_PROPERTY: {
          help = GetPropertyHoverHelp(index, parsed, token);
          break;
        }
        case TOKEN_NAMES.SYSTEM_VARIABLE: {
          help = GetSysVarHoverHelp(index, token);
          break;
        }
        default:
          break;
      }

      // set content
      hover.contents = ResolveHoverHelpLinks(help, config);

      // return hover
      return hover;
    }
  }

  return undefined;
}
