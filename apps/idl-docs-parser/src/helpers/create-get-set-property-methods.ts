import {
  GLOBAL_TOKEN_TYPES,
  GlobalProcedureMethodToken,
  GlobalStructureToken,
  GlobalTokens,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';

/**
 * Works through all structures and adds in properties for docs
 */
export function CreateGetSetPropertyMethods(global: GlobalTokens) {
  /**
   * Get all procedure methods
   */
  const pms = global.filter(
    (item) => item.type === GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
  );

  /**
   * Add them
   */
  const addGlobals: GlobalTokens = [];

  // clear docs lookup
  for (let i = 0; i < global.length; i++) {
    // filter structures
    if (global[i].type === GLOBAL_TOKEN_TYPES.STRUCTURE) {
      const token = global[i] as IGlobalIndexedToken<GlobalStructureToken>;

      /** get token name */
      const name = token.name;

      /** Find get property */
      const getProp = pms.find((item) => item.name === `${name}::getproperty`);

      // add method in
      if (!getProp) {
        const newGlobal: IGlobalIndexedToken<GlobalProcedureMethodToken> = {
          type: GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
          name: `${token.name}::getproperty`,
          pos: token.pos,
          meta: {
            args: {},
            className: token.name,
            display: `${token.meta.display}::getProperty`,
            docs: '',
            docsLookup: {},
            kws: {},
            method: `${token.name}::getproperty`,
            source: token.meta.source,
            struct: [],
          },
        };
        addGlobals.push(newGlobal);
      }

      /** Find set property */
      const setProp = pms.find((item) => item.name === `${name}::setproperty`);

      // add method in
      if (!setProp) {
        const newGlobal: IGlobalIndexedToken<GlobalProcedureMethodToken> = {
          type: GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
          name: `${token.name}::setproperty`,
          pos: token.pos,
          meta: {
            args: {},
            className: token.name,
            display: `${token.meta.display}::setProperty`,
            docs: '',
            docsLookup: {},
            kws: {},
            method: `${token.name}::setproperty`,
            source: token.meta.source,
            struct: [],
          },
        };
        addGlobals.push(newGlobal);
      }
    }
  }

  // add all globals
  global.push(...addGlobals);
}
