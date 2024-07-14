import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { AccessPropertyToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Data structure for property matches
 */
export interface IPropertiesByVarsByLines {
  /** Variables */
  [key: string]: {
    /** Properties by [full line, after property def] */
    [key: string]: [string, string][];
  };
}

/**
 * When we encounter properties for specific variables, track the lines
 * that they happen on
 */
export function ExtractPropertyLines(
  tree: SyntaxTree,
  strings: string[],
  variables: { [key: string]: any },
  properties: { [key: string]: any },
  lines: IPropertiesByVarsByLines
) {
  for (let i = 0; i < tree.length; i++) {
    // recurse if needed
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      ExtractPropertyLines(
        (tree[i] as TreeBranchToken).kids,
        strings,
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

    // get the variable name
    const varName = tree[i].match[0].toLowerCase();

    // skip if we have a variable that we cant replace
    if (!(varName in variables)) {
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
      // make prop lookup if it exists
      if (!(varName in lines)) {
        lines[varName] = {};
      }

      // get prop lookup
      const propLookup = lines[varName];

      // make sure the prop exists
      if (!(propName in propLookup)) {
        propLookup[propName] = [];
      }

      // save info
      propLookup[propName].push([
        strings[prop.pos[0]],
        strings[prop.pos[0]].substring(prop.pos[1]),
      ]);
    }
  }
}
