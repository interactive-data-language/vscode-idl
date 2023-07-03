import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';
import { GetRoutineName } from './get-routine-name';

/**
 * tokens we get the name for
 */
const NAME_THESE: { [key: string]: boolean } = {};
NAME_THESE[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
NAME_THESE[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
NAME_THESE[TOKEN_NAMES.MAIN_LEVEL] = true;

/**
 * Returns the lower-case and trimmed name of the routine that
 * a token belongs to
 *
 * Returns an empty string if we can't determine the routine name
 */
export function GetRoutineNameFromScope(token: TreeToken<TokenName>): string {
  // get scope to track
  const scope = token.scopeTokens || [];

  for (let i = 0; i < scope.length; i++) {
    if (scope[i].name in NAME_THESE) {
      return GetRoutineName(
        scope[i] as TreeToken<
          RoutineProcedureToken | RoutineFunctionToken | MainLevelToken
        >
      );
    }
  }

  return '';
}
