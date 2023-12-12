import {
  GLOBAL_TOKEN_TYPES,
  GlobalRoutineToken,
  GlobalStructureToken,
  GlobalTokens,
  IGlobalIndexedToken,
  IParameterLookup,
} from '@idl/data-types/core';

/**
 * Strips docs from parameter lookups
 */
function ReduceParameters(lookup: IParameterLookup) {
  const values = Object.values(lookup);
  for (let i = 0; i < values.length; i++) {
    values[i].docs = '';
  }
}

/**
 * Removes/empties global tokens
 */
export function ReduceGlobals(globals: GlobalTokens) {
  for (let i = 0; i < globals.length; i++) {
    // clear docs
    globals[i].meta.docs = '';
    // delete globals[i].file;

    // check what else we need to clear
    switch (globals[i].type) {
      case GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD:
      case GLOBAL_TOKEN_TYPES.PROCEDURE:
      case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
      case GLOBAL_TOKEN_TYPES.FUNCTION: {
        const g = globals[i] as GlobalRoutineToken;
        g.meta.docsLookup = {};
        g.meta.struct = [];
        ReduceParameters(g.meta.args);
        ReduceParameters(g.meta.kws);
        break;
      }
      case GLOBAL_TOKEN_TYPES.STRUCTURE: {
        const g = globals[i] as IGlobalIndexedToken<GlobalStructureToken>;
        g.meta.docsLookup = {};
        ReduceParameters(g.meta.props);
        break;
      }
      default:
        break;
    }
  }

  return globals;
}
