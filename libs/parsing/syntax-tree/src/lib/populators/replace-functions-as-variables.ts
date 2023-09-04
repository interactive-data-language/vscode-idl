import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
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
import { IParsed } from '../build-syntax-tree.interface';
import { SyntaxProblemWithTranslation } from '../syntax-problem-with';
import { ILocalTokenLookup } from './populate-local.interface';

/**
 * Recursor to change function calls to variables being indexed
 */
function _Recursor(
  parsed: IParsed,
  tree: SyntaxTree,
  local: ILocalTokenLookup
) {
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

        // save as syntax problem
        tree[i].parseProblems.push(IDL_PROBLEM_CODES.ILLEGAL_VARIABLE_INDEX);

        // track in syntax tree
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.ILLEGAL_VARIABLE_INDEX,
            tree[i].pos,
            (tree[i] as TreeBranchToken).end !== undefined
              ? (tree[i] as TreeBranchToken).end.pos
              : tree[i].pos
          )
        );

        // create a variable token and insert
        tree.splice(i, 0, variable);

        // track that we have used our variable
        local[name].meta.usage.push(variable.pos);

        // recurse
        _Recursor(parsed, (tree[i + 1] as TreeBranchToken).kids, local);

        // skip ahead
        i++;
        continue;
      }
    }

    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      _Recursor(parsed, (tree[i] as TreeBranchToken).kids, local);
    }
  }
}

/**
 * Replaces functions that are really variables with the proper tokens
 */
export function ReplaceFunctionsAsVariables(
  parsed: IParsed,
  branch: IBranch<
    RoutineProcedureToken | RoutineFunctionToken | MainLevelToken
  >,
  local: ILocalTokenLookup
) {
  _Recursor(parsed, branch.kids, local);
}
