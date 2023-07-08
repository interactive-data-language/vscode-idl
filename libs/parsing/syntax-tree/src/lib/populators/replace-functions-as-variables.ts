import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
  VariableToken,
} from '@idl/parsing/tokenizer';

import {
  BRANCH_TYPES,
  IBranch,
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '../branches.interface';
import { IParsed } from '../build-tree.interface';
import { GetUniqueVariables } from './get-unique-variables';
import { ILocalTokenLookup } from './populate-local.interface';

/**
 * Recursor to change function calls to variables being indexed
 */
function _Recursor(tree: SyntaxTree, local: ILocalTokenLookup) {
  for (let i = 0; i < tree.length; i++) {
    /**
     * Do we have a function call?
     */
    if (tree[i].name === TOKEN_NAMES.CALL_FUNCTION) {
      /** Name of the function call */
      const name = tree[i].match[1].toLowerCase();

      // do we have a variable with the same name? if so, save usage
      if (name in local) {
        const variable: TreeToken<VariableToken> = {
          type: BRANCH_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          parseProblems: [],
          match: [tree[i].match[1]],
          pos: [tree[i].pos[0], tree[i].pos[1], name.length],
          scope: tree[i].scope,
          idx: i,
        };

        // update the position
        tree[i].pos = [
          tree[i].pos[0],
          tree[i].pos[1] + name.length,
          tree[i].pos[2] - name.length,
        ];

        // update the type
        tree[i].name = TOKEN_NAMES.BRACKET;

        // update our match
        tree[i].match = [tree[i].match[0].substring(name.length)];

        // create a variable token and insert
        tree.splice(i, 0, variable);

        // track that we have used our variable
        local[name].meta.usage.push(variable.pos);

        // recurse
        _Recursor((tree[i + 1] as TreeBranchToken).kids, local);

        // skip ahead
        i++;
        continue;
      }
    }

    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      _Recursor((tree[i] as TreeBranchToken).kids, local);
    }
  }
}

/**
 * Replaces functions that are really variables with the proper tokens
 */
export function ReplaceFunctionsAsVariables(
  branch: IBranch<
    RoutineProcedureToken | RoutineFunctionToken | MainLevelToken
  >,
  local: ILocalTokenLookup
) {
  _Recursor(branch.kids, local);
}

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
