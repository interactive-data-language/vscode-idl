import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IDL_ANY_TYPE,
  IGlobalIndexedToken,
  IPropertyLookup,
} from '@idl/data-types/core';
import {
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';
import { FindAllBranchChildren } from '../helpers/searching/find-all-branch-children';
import { FindDirectBranchChildren } from '../helpers/searching/find-direct-branch-children';

/**
 * Finds all named structures within a procedure and returns an array of global tokens
 */
export function FindStructureDefs(
  token: TreeToken<RoutineProcedureToken | RoutineFunctionToken>,
  routineName: string,
  structures: { [key: string]: any }
): IGlobalIndexedToken<GlobalStructureToken>[] {
  /** global structures that we return */
  const found: IGlobalIndexedToken<GlobalStructureToken>[] = [];

  /**
   * If we are not in a class definition, we never track structures
   *
   * Otherwise, we end up tracking structures in each and every file they get
   * defined with properties.
   *
   * Because of this ambiguity, and because most users should follow the right
   * pattern, we will be strict here.
   */
  if (!routineName.endsWith('__define')) {
    return found;
  }

  /** Find all named structures */
  const structs = FindAllBranchChildren(token, TOKEN_NAMES.STRUCTURE_NAME);

  // process each structure
  for (let i = 0; i < structs.length; i++) {
    /** Get the name of the structure */
    const name = structs[i].match[0];

    /** Get lower case name */
    const lowName = name.toLowerCase();

    // skip if already found
    if (lowName in structures) {
      continue;
    }

    // check for inheritance statements
    const inheritance = FindDirectBranchChildren(
      structs[i],
      TOKEN_NAMES.STRUCTURE_INHERITANCE
    );

    // build the inheritance information
    const inherits: string[] = [];
    for (let j = 0; j < inheritance.length; j++) {
      if (inheritance[j].match.length > 1) {
        inherits.push(inheritance[j].match[1].toLowerCase());
      }
    }

    /**
     * Init properties
     */
    const props: IPropertyLookup = {};

    /**
     * Initialize our global token
     */
    const global: IGlobalIndexedToken<GlobalStructureToken> = {
      type: GLOBAL_TOKEN_TYPES.STRUCTURE,
      name: lowName,
      pos: structs[i].pos,
      meta: {
        display: name,
        inherits,
        docs: '',
        props,
        source: 'user',
      },
    };

    // get all of our properties
    const propTokens = FindDirectBranchChildren(
      structs[i],
      TOKEN_NAMES.STRUCTURE_PROPERTY
    );

    // add all of our properties
    for (let j = 0; j < propTokens.length; j++) {
      const prop = propTokens[j];
      const propName = prop.match[1];
      const useName = propName.toLowerCase();
      props[useName] = {
        direction: 'bidirectional',
        display: propName,
        code: true,
        source: 'user',
        docs: '',
        type: IDL_ANY_TYPE,
        pos: prop.pos,
      };
    }

    // save to global
    found.push(global);
  }

  return found;
}
