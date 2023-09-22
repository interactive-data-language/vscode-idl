import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseIndexedToken,
  IDL_TYPE_LOOKUP,
  IDLTypeHelper,
} from '@idl/data-types/core';
import {
  GetTokenAtCursor,
  GetVariableTokenDef,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { GetTokenDefResponse } from '@idl/workers/parsing';
import { Position } from 'vscode-languageserver';

import { GetKeyword } from '../helpers/get-keyword';
import { GetProperty } from '../helpers/get-property';
import { IDLIndex } from '../idl-index.class';
import { GetCallRoutineTokenDef } from './definitions-for/get-call-routine-token-def';
import { GetIncludeDef } from './definitions-for/get-include-def';
import { GetStructureDef } from './definitions-for/get-structure-def';

/**
 * Flag if we use the cache while getting token definitions
 */
export const CACHE_FOR_TOKEN_DEF = false;

/**
 * Returns the location of where a selected token is located
 */
export async function GetTokenDefinition(
  index: IDLIndex,
  file: string,
  code: string | string[],
  position: Position
): Promise<GetTokenDefResponse> {
  // initialize the value of our help
  let info: IBaseIndexedToken;

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
    const cursor = GetTokenAtCursor(parsed, position);

    // unpack for easier access
    const token = cursor.token;
    const parent = cursor.globalParent;

    // check if we found a token
    if (token !== undefined) {
      // check what we have selected and act accordingly
      switch (token.name) {
        case TOKEN_NAMES.KEYWORD:
          info = GetKeyword(index, parsed, token, CACHE_FOR_TOKEN_DEF);
          break;
        case TOKEN_NAMES.KEYWORD_BINARY:
          info = GetKeyword(index, parsed, token, CACHE_FOR_TOKEN_DEF);
          break;
        case TOKEN_NAMES.VARIABLE: {
          info = GetVariableTokenDef(parsed, token, parent);
          // set file if we have a variable
          if (info !== undefined) {
            // if we dont have a file source, set as current file
            // other case if from include
            if (info.file === undefined) {
              info.file = file;
            }

            // overwrite position if we have true source
            if (info.filePos !== undefined) {
              info.pos = info.filePos;
            }
          }
          break;
        }
        case TOKEN_NAMES.CALL_FUNCTION:
          info = GetCallRoutineTokenDef(index, parsed, token);
          break;
        case TOKEN_NAMES.CALL_FUNCTION_METHOD: {
          info = GetCallRoutineTokenDef(index, parsed, token);
          break;
        }
        case TOKEN_NAMES.CALL_PROCEDURE:
          info = GetCallRoutineTokenDef(index, parsed, token);
          break;
        case TOKEN_NAMES.CALL_PROCEDURE_METHOD: {
          info = GetCallRoutineTokenDef(index, parsed, token);
          break;
        }
        case TOKEN_NAMES.STRUCTURE_NAME:
          info = GetStructureDef(index, token);
          break;
        case TOKEN_NAMES.STRUCTURE_PROPERTY: {
          info = GetProperty(index, parsed, token, CACHE_FOR_TOKEN_DEF);
          break;
        }
        case TOKEN_NAMES.ACCESS_PROPERTY: {
          const pInfo = GetProperty(index, parsed, token, CACHE_FOR_TOKEN_DEF);
          if (pInfo !== undefined) {
            /**
             * If we have an anonymous structure, then set the file as local
             */
            if (IDLTypeHelper.isType(pInfo.class, IDL_TYPE_LOOKUP.STRUCTURE)) {
              pInfo.file = file;
            }
          }
          info = pInfo;
          break;
        }
        case TOKEN_NAMES.INCLUDE: {
          info = GetIncludeDef(index, token);
          break;
        }
        default:
          break;
      }
    }
  }

  return info;
}
