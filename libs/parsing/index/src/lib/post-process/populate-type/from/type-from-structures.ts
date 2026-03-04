import { SyntaxProblemWithoutTranslation } from '@idl/parsing/shared';
import {
  FindDirectBranchChildren,
  GetPropertyName,
  GetRoutineNameFromScope,
} from '@idl/parsing/syntax-tree';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { StructureToken, TOKEN_NAMES } from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_STRUCTURE_TYPE,
  IDLDataType,
} from '@idl/types/idl-data-types';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import { IParsed, TreeToken } from '@idl/types/syntax-tree';
import { copy } from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromTokens } from './type-from-tokens';

/**
 * Attempts to determine the type from a single variable
 */
export function TypeFromStructure(
  index: IDLIndex,
  token: TreeToken<StructureToken>,
  parsed: IParsed
): IDLDataType {
  // get the name of the routine we are in
  const routineName = GetRoutineNameFromScope(token);

  // check for structure name
  const name = FindDirectBranchChildren(token, TOKEN_NAMES.STRUCTURE_NAME);

  // we have a name!
  if (name.length > 0) {
    // search for global structure definition
    const global = index.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.STRUCTURE,
      name[0].match[0]
    );

    // check if we have a  match or not
    if (global.length > 0) {
      return IDLTypeHelper.parseIDLType(global[0].meta.display);
    } else {
      // report as unknown structure
      if (!routineName.endsWith('__define')) {
        parsed.postProcessProblems.push(
          SyntaxProblemWithoutTranslation(
            IDL_PROBLEM_CODES.UNKNOWN_STRUCTURE,
            IDL_TRANSLATION.parsing.errors[
              IDL_PROBLEM_CODES.UNKNOWN_STRUCTURE
            ].replace('#SNAME', `"${name[0].match[0].trim()}"`),
            name[0].pos,
            name[0].pos
          )
        );
      }

      // parse type and return anyways
      return IDLTypeHelper.parseIDLType(name[0].match[0]);
    }
  }

  // create output data type
  const type = copy(IDL_STRUCTURE_TYPE);

  // get our properties
  const properties = FindDirectBranchChildren(
    token,
    TOKEN_NAMES.STRUCTURE_PROPERTY
  );

  // init properties
  type[0].meta.properties = {};

  // resolve types for our properties
  for (let i = 0; i < properties.length; i++) {
    // extract property
    const prop = properties[i];

    // get the property name
    const propName = GetPropertyName(prop);

    // get lower case name
    const usePropName = propName.toLowerCase();

    // check if we should process and save
    if (!(usePropName in type[0].meta.properties)) {
      type[0].meta.properties[usePropName] = {
        display: propName,
        type: TypeFromTokens(index, parsed, prop.kids),
        direction: 'bidirectional',
        source: 'user',
        docs: '',
        code: true,
        pos: prop.pos,
      };
    }
  }

  // default return value
  return type;
}
