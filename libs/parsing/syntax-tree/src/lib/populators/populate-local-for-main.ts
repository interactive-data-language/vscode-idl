import { MainLevelToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { IBranch } from '../branches.interface';
import { IParsed } from '../build-syntax-tree.interface';
import { GetUniqueVariables } from './get-unique-variables';

/**
 * Populates a lookup with quick information for where local things are defined
 */
export function PopulateLocalForMain(parsed: IParsed) {
  // get local tokens
  const local = parsed.local;

  // extract our tree
  const tree = parsed.tree;

  // process all of the direct children in our tree
  for (let i = 0; i < tree.length; i++) {
    // extract our branch
    const branch = tree[i];

    // determine how to proceed
    switch (branch.name) {
      // handle main level programs - the others are handled elsewhere
      // inside of "populate-global.ts" or you can search for the name of the
      // function "GetUniqueVariables("
      case TOKEN_NAMES.MAIN_LEVEL:
        local.main = GetUniqueVariables(
          branch as IBranch<MainLevelToken>,
          parsed,
          parsed.compile.main
        );
        break;
      default:
        // do nothing
        break;
    }
  }
}
