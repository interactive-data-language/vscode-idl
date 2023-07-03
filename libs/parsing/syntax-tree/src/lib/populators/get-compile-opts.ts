import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { IBranch } from '../branches.interface';
import { FindAllBranchChildren } from '../helpers/searching/find-all-branch-children';

/**
 * Extracts compile options for our routine and returns a lower-case string array
 * of our compile options
 */
export function GetCompileOpts(
  token: IBranch<RoutineFunctionToken | RoutineProcedureToken | MainLevelToken>
): string[] {
  // initialize return value
  const opts: string[] = [];

  // find all compile opts
  const children = FindAllBranchChildren(
    token,
    TOKEN_NAMES.CONTROL_COMPILE_OPT
  );

  // process all compile opt statements
  for (let i = 0; i < children.length; i++) {
    // get the options which are parsed as control options
    for (let j = 0; j < children[i].kids.length; j++) {
      if (children[i].kids[j].name === TOKEN_NAMES.CONTROL_OPTION) {
        const option = children[i].kids[j].match[0].toLowerCase();
        if (opts.indexOf(option) === -1) {
          opts.push(option);
        } else {
          // TODO: if duplicate compile option, raise an exception
        }
      }
    }
  }

  return opts;
}
