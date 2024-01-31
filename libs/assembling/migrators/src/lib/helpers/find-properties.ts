import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { AccessPropertyToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * When we encounter properties for specific variables, track the lines
 * that they happen on
 */
export function FindProperties(
  tree: SyntaxTree,
  variables: { [key: string]: any },
  properties: { [key: string]: any },
  lines: { [key: string]: any }
) {
  for (let i = 0; i < tree.length; i++) {
    // recurse if needed
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      FindProperties(
        (tree[i] as TreeBranchToken).kids,
        variables,
        properties,
        lines
      );
      continue;
    }

    // skip if not variable
    if (tree[i].name !== TOKEN_NAMES.VARIABLE) {
      continue;
    }

    // skip if we have a variable that we cant replace
    if (!(tree[i].match[0].toLowerCase() in variables)) {
      continue;
    }

    // make sure the next token is a property accessor
    if (tree[i + 1]?.name !== TOKEN_NAMES.ACCESS_PROPERTY) {
      continue;
    }

    /** Get the property token */
    const prop = tree[i + 1] as TreeToken<AccessPropertyToken>;

    /** Get the property name */
    const propName = prop.match[0].substring(1).toLowerCase();

    /** Check if we need to update it */
    if (propName in properties) {
      lines[prop.pos[0]] = undefined;
      // prop.match[0] = `.${toCommentOut[propName]}`;
    }
  }
}
