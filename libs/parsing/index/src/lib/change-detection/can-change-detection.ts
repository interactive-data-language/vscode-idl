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
 * Determines if we can perform change detection against old and new global tokens. Compares
 * an array of the types and names from two sets of global tokens
 *
 * TODO: Eventually return the global tokens that we should do change detection for
 */
export function CanChangeDetection(
  globals: GlobalTokens,
  oldGlobals: GlobalTokens
) {
  return !deepEqual(ReduceGlobals(globals), ReduceGlobals(oldGlobals));
}
