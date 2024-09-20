import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  GlobalProcedureMethodToken,
  GlobalProcedureToken,
  GlobalStructureToken,
  GlobalSystemVariableToken,
  GlobalTokens,
  IGlobalIndexedToken,
  IParameterLookup,
  IPropertyLookup,
} from '@idl/types/core';
import { deepEqual } from 'fast-equals';

/**
 * Reduces parameters to basic values
 */
function ReduceParameters(params: IParameterLookup | IPropertyLookup) {
  return Object.values(params)
    .filter((param) => param.code)
    .map((param) => {
      return { name: param.display.toLowerCase(), type: param.type };
    });
}

/**
 * Reduce global tokens to a basic form for comparison
 */
function ReduceGlobals(globals: GlobalTokens) {
  const reduced: any[] = [];
  for (let i = 0; i < globals.length; i++) {
    // add basic info
    const info: any = { type: globals[i].type, name: globals[i].name };

    // check if there is special information (primarily about types) that we need to add
    switch (globals[i].type) {
      case GLOBAL_TOKEN_TYPES.FUNCTION:
        {
          const global = globals[i] as IGlobalIndexedToken<GlobalFunctionToken>;
          info.returns = global.meta.returns;
          info.args = ReduceParameters(global.meta.args);
          info.keywords = ReduceParameters(global.meta.kws);
        }
        break;
      case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
        {
          const global = globals[
            i
          ] as IGlobalIndexedToken<GlobalFunctionMethodToken>;
          info.returns = global.meta.returns;
          info.args = ReduceParameters(global.meta.args);
          info.keywords = ReduceParameters(global.meta.kws);
        }
        break;
      case GLOBAL_TOKEN_TYPES.PROCEDURE:
        {
          const global = globals[
            i
          ] as IGlobalIndexedToken<GlobalProcedureToken>;
          info.args = ReduceParameters(global.meta.args);
          info.keywords = ReduceParameters(global.meta.kws);
        }
        break;
      case GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD:
        {
          const global = globals[
            i
          ] as IGlobalIndexedToken<GlobalProcedureMethodToken>;
          info.args = ReduceParameters(global.meta.args);
          info.keywords = ReduceParameters(global.meta.kws);
        }
        break;
      case GLOBAL_TOKEN_TYPES.STRUCTURE:
        {
          const global = globals[
            i
          ] as IGlobalIndexedToken<GlobalStructureToken>;
          info.properties = ReduceParameters(global.meta.props);
        }
        break;
      case GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE:
        {
          const global = globals[
            i
          ] as IGlobalIndexedToken<GlobalSystemVariableToken>;
          info.type = global.meta.type;
        }
        break;
      // case GLOBAL_TOKEN_TYPES.COMMON:
      //   {
      //     const global = globals[
      //       i
      //     ] as IGlobalIndexedToken<GlobalCommonToken>;
      //     info.type = global.;
      //   }
      //   break;
      default:
        break;
    }
    reduced.push(info);
  }
  return reduced;
}

/**
 * Gets global tokens that have changed to have targeted change detection
 * workflows
 */
export function GetChangedGlobals(
  globals: GlobalTokens,
  oldGlobals: GlobalTokens
): GlobalTokens {
  /** Track global tokens */
  const changed: GlobalTokens = [];

  /** Reduce original globals */
  const reduced = ReduceGlobals(globals);

  /** Reduce old globals */
  const oldReduced = ReduceGlobals(oldGlobals);

  /**
   * Find new or changed tokens
   */
  for (let i = 0; i < globals.length; i++) {
    /** Flag if we have a matching token in our  */
    let found = false;

    // compare against all old items
    for (let j = 0; j < oldGlobals.length; j++) {
      // check for matching token
      if (
        oldGlobals[j].type === globals[i].type &&
        oldGlobals[j].name === globals[i].name
      ) {
        // check if same, if not we have changes and did not "find" it
        if (deepEqual(reduced[i], oldReduced[j])) {
          found = true;
        }

        // found a match - always break
        break;
      }
    }

    if (!found) {
      changed.push(globals[i]);
    }
  }

  /**
   * Search for removed tokens
   */
  for (let i = 0; i < oldGlobals.length; i++) {
    /** Flag if we have token that exists or not */
    let found = false;

    // compare against new - only do shallow check for name and type
    // since we look for changes up above
    for (let j = 0; j < globals.length; j++) {
      // check for matching token
      if (
        oldGlobals[i].type === globals[j].type &&
        oldGlobals[i].name === globals[j].name
      ) {
        // update flag as found
        found = true;

        // found a match - always break
        break;
      }
    }

    if (!found) {
      changed.push(oldGlobals[i]);
    }
  }

  return changed;
}
