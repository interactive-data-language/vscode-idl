import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { IBranch } from '../branches.interface';
import { MAIN_LEVEL_NAME } from '../populators/populate-global.interface';

/**
 * tokens we get the name for
 */
const NAME_THESE: { [key: string]: boolean } = {};
NAME_THESE[TOKEN_NAMES.ROUTINE_NAME] = true;
NAME_THESE[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Returns the lower-case and trimmed name of our top-level
 * token as main, procedure, or function definition
 *
 * Returns an empty string if we can't determine the routine name
 */
export function GetRoutineName(
  branch: IBranch<RoutineProcedureToken | RoutineFunctionToken | MainLevelToken>
): string {
  // initialize name value
  let name = '';

  // determine how to proceed
  switch (true) {
    case branch.name === TOKEN_NAMES.MAIN_LEVEL:
      name = MAIN_LEVEL_NAME;
      break;
    default: {
      // make sure we have children
      if (branch.kids.length > 0) {
        if (branch.kids[0].name in NAME_THESE) {
          name = branch.kids[0].match[0].toLowerCase().trim();
        }
      }
    }
  }

  return name;
}
