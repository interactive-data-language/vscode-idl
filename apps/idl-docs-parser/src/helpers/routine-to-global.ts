import { GlobalDisplayNameLookup, IGlobalFromIDL } from '@idl/parsing/routines';
import { DocsToMarkdown, MARKDOWN_TYPE_LOOKUP } from '@idl/parsing/syntax-tree';
import { ResolveProductDocsURL } from '@idl/shared';
import {
  DEFAULT_DATA_TYPE,
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  GlobalProcedureMethodToken,
  GlobalProcedureToken,
  GlobalRoutineTokenType,
  GlobalStructureToken,
  GlobalSystemVariableToken,
  GlobalTokens,
  IGlobalIndexedToken,
  IParameterOrPropertyDetails,
  ParameterDirection,
  ParseIDLType,
  SerializeIDLType,
} from '@idl/types/core';
import * as merge from 'deepmerge';
import { join } from 'path';

import { IDocsByRoutine } from '../main.interface';
import { PROCEDURE_CLEANERS } from '../overrides/cleaners/procedures.interface';
import { FUNCTION_METHOD_OVERRIDE } from '../overrides/detail/function-methods.interface';
import { FUNCTION_OVERRIDE } from '../overrides/detail/functions.interface';
import { PROCEDURE_METHOD_OVERRIDE } from '../overrides/detail/procedure-methods.interface';
import { PROCEDURE_OVERRIDE } from '../overrides/detail/procedures.interface';
import {
  ADD_STRUCTURES,
  STRUCTURE_OVERRIDE,
} from '../overrides/detail/structures.interface';
import { HAS_EXTRA_KEYWORDS } from '../overrides/properties-and-keywords/has-extra-keywords';
import { KEYWORD_ARE_PROPS } from '../overrides/properties-and-keywords/keywords-are-props';
import { PROPERTIES_ARE_KEYWORDS } from '../overrides/properties-and-keywords/properties-are-keywords';
import { DIMENSION_ARGS } from '../overrides/shared/dimension-args.interface';
import { ENVI_ERROR_KEYWORD } from '../overrides/shared/envi-error.interface';
import { THREAD_POOL_KEYWORDS } from '../overrides/shared/thread-pool.interface';
import { FUNCTION_METHOD_SKIPS } from '../overrides/skips/function-methods.interface';
import { FUNCTION_SKIPS } from '../overrides/skips/functions.interface';
import { PROCEDURE_METHOD_SKIPS } from '../overrides/skips/procedure-methods.interface';
import { PROCEDURE_SKIPS } from '../overrides/skips/procedures.interface';
import { STRUCTURE_SKIPS } from '../overrides/skips/structures.interface';
import {
  FUNCTION_METHOD_TYPE_OVERRIDES,
  FUNCTION_TYPE_OVERRIDES,
  IDL_STRUCTURE_TYPE_OVERRIDES,
  PROCEDURE_METHOD_TYPE_OVERRIDES,
  PROCEDURE_TYPE_OVERRIDES,
} from '../overrides/types/type-overrides.interface';
import { IParameterOverride } from '../overrides/types/types.interface';
import { InheritanceGuess } from '../type-guess/inheritance-guess';
import { TypeGuess } from '../type-guess/type-guess';
import { MethodDisplayName, StructureDisplayName } from './display-names';
import { DocsParser } from './docs-parser';
import { IParameterDocs } from './process-parameters.interface';
import { SKIP_GLOBAL } from './skip-routines.interface';

/**
 * Lookup of read + processed files for quick access + parsing later if we
 * have multiple entries int he same file
 */
const LOOKUP: { [key: string]: IDocsByRoutine } = {};

// /** Default source for our routines */
// const SOURCE = GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL;

/**
 * Track the names of struct we have processed already
 * so we don't duplicate effort
 */
const STRUCTURES: { [key: string]: boolean } = {};

/** Default dir for parameters */
const DEFAULT_DIRECTION: ParameterDirection = 'bidirectional';

/**
 * Handles merging items together from overrides and maintaining the proper order
 */
function MergeHelper(
  item: IParameterOrPropertyDetails,
  mergeThis?: Partial<IParameterOrPropertyDetails>
) {
  // do we have items to merge?
  if (mergeThis !== undefined) {
    // merge the two together
    const mergedObj = merge(item, mergeThis);

    // properly inherit type
    if (mergeThis?.type !== undefined) {
      mergedObj.type = mergeThis.type;
    }

    // if there are no docs, try using the original
    if (mergedObj.docs === '') {
      mergedObj.docs = item.docs;
    }

    return mergedObj;
  } else {
    // otherwise just return our original
    return item;
  }
}

/**
 * Merge entries together and handle fancy override logic
 */
function MergeEntries(
  params: IParameterDocs,
  override: { [key: string]: Partial<IParameterOrPropertyDetails> },
  jsonOverride: { [key: string]: IParameterOverride }
) {
  // check if we have thread pool keywords
  if ('thread pool keywords' in params) {
    delete params['thread pool keywords'];
    delete override['thread pool keywords'];
    delete jsonOverride['thread pool keywords'];
    Object.assign(override, THREAD_POOL_KEYWORDS);
  }

  // check if we have thread pool keywords
  if ('di' in params) {
    delete params['di'];
    delete override['di'];
    delete jsonOverride['di'];
    Object.assign(override, DIMENSION_ARGS);
  }

  // initialize output
  const ready: {
    [key: string]: IParameterOrPropertyDetails;
  } = {};

  // get property names
  const names = Array.from(
    new Set(
      Object.keys(params)
        .concat(Object.keys(override))
        .concat(Object.keys(jsonOverride))
    )
  );

  // process all properties
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const useName = name.toLowerCase();

    // initial value for starting type
    let startType =
      name in jsonOverride ? jsonOverride[useName].type : DEFAULT_DATA_TYPE;

    /**
     * If there is no initial guess for data type, and we don't have
     */
    if (
      startType === DEFAULT_DATA_TYPE &&
      override[useName]?.type === undefined
    ) {
      startType = TypeGuess(params[name] || '');
      jsonOverride[useName].type = startType;
    }

    // make the metadata for our structure and merge with overrides
    ready[useName] = MergeHelper(
      {
        display: name,
        docs: params[name] || '',
        type: ParseIDLType(startType),
        direction:
          name in jsonOverride
            ? jsonOverride[useName].direction
            : DEFAULT_DIRECTION,
        source: GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL,
        code: true,
        pos: [0, 0, 0],
      },
      override[useName]
    );

    if (useName in jsonOverride) {
      jsonOverride[useName] = {
        type: SerializeIDLType(ready[useName].type),
        direction: ready[useName].direction,
      };
    }
  }

  return ready;
}

/**
 * Converts a parsed routine to a global token and creates any/all tokens that might be needed
 */
export async function RoutineToGlobal(
  r: IGlobalFromIDL,
  helpDir: string,
  global: GlobalTokens,
  lookup: GlobalDisplayNameLookup
) {
  /** Type of global token we got from IDL */
  let type = r.type;

  /** Name of the global token. Special case for "!null" */
  const name = r.name === null ? '!NULL' : r.name;

  if (name.toLowerCase().endsWith('::init')) {
    type = GLOBAL_TOKEN_TYPES.FUNCTION_METHOD;
  }

  /** Comparison name to look for in the docs lookup */
  const useName = name.toLowerCase();

  // check if we have a matching global token to skip
  if (useName in SKIP_GLOBAL) {
    return;
  }

  /** Where does our routine come from */
  const source = r.source;

  // split the link to our content by the hashtag
  const split = r.link.split('#');

  // get first part of the file
  const file = split[0];

  /** If there is a link within the file that we parsed, check for it */
  const link = split.length > 1 ? split[1] : '';

  // make the path to the file
  const path = join(`${helpDir}${file}`);

  /** Docs parsed for our file */
  let parsed: IDocsByRoutine;
  try {
    // check if in our lookup otherwise parse
    if (file in LOOKUP) {
      parsed = LOOKUP[file];
    } else {
      parsed = await DocsParser(path, lookup);

      // save in our lookup
      LOOKUP[file] = parsed;
    }
  } catch (err) {
    console.log('');
    console.log(`Error while processing file: ${JSON.stringify(path)}`);
    console.log(err);
    process.exit(1);
  }

  // extra cases for our use name
  let keyName = useName;
  if (!(keyName in parsed)) {
    // handle a few edge cases with ENVI Deep learning
    if (keyName.startsWith('envi') && keyName.endsWith('task')) {
      keyName = keyName.substring(4, keyName.length - 4) + ' task';
    }

    // edge cases with typos
    if (keyName === 'envinitf::getsegmentfields') {
      keyName = 'vinitf::getsegmentfields';
    }

    // for methods, relaxed search matching logic in resolve-methods.ts
    if (!(keyName in parsed)) {
      if (useName.includes('::')) {
        const splitName = useName.split('::');
        const keys = Object.keys(parsed);
        if (
          keys[0].includes(`::${splitName[1]}`) ||
          keys[0].startsWith(splitName[1])
        ) {
          keyName = keys[0];
        }
      }
    }

    if (!(keyName in parsed)) {
      console.log('');
      console.log(
        `Routine name "${keyName}" is missing from parsed content for file: ${JSON.stringify(
          path
        )}`
      );
      console.log(Object.keys(parsed));
      console.log(
        'See if we need a new entry around line 475 in catalog_to_json.pro, re-run that, and try this again'
      );
      process.exit(1);
    }
  }

  // make the URL for our online docs
  const url = ResolveProductDocsURL(r.link);

  // get our parsed content
  const routine = parsed[keyName];

  // check if we have kws that are supposed to be properties
  if (useName in KEYWORD_ARE_PROPS) {
    Object.assign(routine.properties, routine.keywords);
  }

  // check if we have kws that we need to add to the properties
  if (useName in PROPERTIES_ARE_KEYWORDS) {
    Object.assign(routine.keywords, routine.properties);
  }

  // check if we need to add an extra keyword
  if (useName in HAS_EXTRA_KEYWORDS) {
    if (
      HAS_EXTRA_KEYWORDS[useName].indexOf(type as GlobalRoutineTokenType) !== -1
    ) {
      routine.keywords['_extra'] = 'Support for additional keywords';
    }
  }

  // check the number of properties
  const nProps = Object.keys(routine.properties).length;
  const hasProps = nProps > 0;

  // flags for naming convention
  const enviClass = name.startsWith('ENVI');
  const idlClass = name.startsWith('IDL');
  const isClass = (hasProps || enviClass || idlClass) && !name.includes('::');

  // determine how to proceed
  switch (type) {
    case GLOBAL_TOKEN_TYPES.FUNCTION:
      {
        // check if we have properties and inheritance information that we need to share with a structure
        // this is primarily for ENVI and it is the kws that match the same properties
        if (isClass) {
          if (useName in FUNCTION_OVERRIDE) {
            if (useName in STRUCTURE_OVERRIDE) {
              STRUCTURE_OVERRIDE[useName].properties = {
                ...FUNCTION_OVERRIDE[useName].kws,
                ...STRUCTURE_OVERRIDE[useName].properties,
              };
            } else {
              STRUCTURE_OVERRIDE[useName] = {
                properties: FUNCTION_OVERRIDE[useName].kws,
              };
            }
          }
        }

        // populate function values in type overrides
        if (!(useName in FUNCTION_TYPE_OVERRIDES)) {
          FUNCTION_TYPE_OVERRIDES[useName] = {
            returns: isClass ? useName : DEFAULT_DATA_TYPE,
            args: {},
            kws: {},
          };
        }

        if (!FUNCTION_TYPE_OVERRIDES[useName].args) {
          FUNCTION_TYPE_OVERRIDES[useName].args = {};
        }
        if (!FUNCTION_TYPE_OVERRIDES[useName].kws) {
          FUNCTION_TYPE_OVERRIDES[useName].kws = {};
        }

        // auto-populate returns value
        if (FUNCTION_TYPE_OVERRIDES[useName].returns === undefined) {
          FUNCTION_TYPE_OVERRIDES[useName].returns = isClass
            ? useName
            : DEFAULT_DATA_TYPE;
        }

        // merge in any arguments or kws that dont exist
        const ags = Object.keys(routine.args);
        for (let z = 0; z < ags.length; z++) {
          if (
            !(ags[z].toLowerCase() in FUNCTION_TYPE_OVERRIDES[useName].args)
          ) {
            FUNCTION_TYPE_OVERRIDES[useName].args[ags[z].toLowerCase()] = {
              direction: DEFAULT_DIRECTION,
              type: DEFAULT_DATA_TYPE,
            };
          }
        }

        // merge in any arguments or kws that dont exist
        const kws = Object.keys(routine.keywords);
        for (let z = 0; z < kws.length; z++) {
          if (!(kws[z].toLowerCase() in FUNCTION_TYPE_OVERRIDES[useName].kws)) {
            FUNCTION_TYPE_OVERRIDES[useName].kws[kws[z].toLowerCase()] = {
              direction: DEFAULT_DIRECTION,
              type: DEFAULT_DATA_TYPE,
            };
          }
        }

        // check if we have functions to skip
        if (!(useName in FUNCTION_SKIPS)) {
          // make our global token
          const token: IGlobalIndexedToken<GlobalFunctionToken> = {
            type: GLOBAL_TOKEN_TYPES.FUNCTION,
            name: useName,
            pos: [0, 0, 0],
            meta: {
              display: name,
              source: source,
              docs: '',
              private: false,
              returns:
                FUNCTION_OVERRIDE[useName]?.returns ||
                ParseIDLType(
                  isClass
                    ? useName
                    : FUNCTION_TYPE_OVERRIDES[useName]?.returns ||
                        DEFAULT_DATA_TYPE
                ),
              args: MergeEntries(
                routine.args,
                FUNCTION_OVERRIDE[useName]?.args || {},
                FUNCTION_TYPE_OVERRIDES[useName]?.args || {}
              ),
              kws: MergeEntries(
                routine.keywords,
                FUNCTION_OVERRIDE[useName]?.kws || {},
                FUNCTION_TYPE_OVERRIDES[useName]?.kws || {}
              ),
              docsLookup: routine.docs,
              struct: [],
            },
          };

          // check for ENVI keyword
          if (enviClass) {
            if ('error' in token.meta.kws) {
              const err = token.meta.kws['error'];
              err.direction = ENVI_ERROR_KEYWORD.direction;
              err.type = ENVI_ERROR_KEYWORD.type;
            }
          }

          // make fancy docs for our routine
          token.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
            name,
            meta: token.meta,
            link: url,
          });

          // save URL
          routine.docs['url'] = url;

          // save token
          global.push(token);
        }
      }
      break;
    case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
      {
        const splitName = useName.split('::');

        // populate function values in type overrides
        if (!(useName in FUNCTION_METHOD_TYPE_OVERRIDES)) {
          FUNCTION_METHOD_TYPE_OVERRIDES[useName] = {
            returns: isClass ? useName : DEFAULT_DATA_TYPE,
            args: {},
            kws: {},
          };
        }

        // auto-populate returns value
        if (!FUNCTION_METHOD_TYPE_OVERRIDES[useName].returns) {
          FUNCTION_METHOD_TYPE_OVERRIDES[useName].returns = isClass
            ? useName
            : DEFAULT_DATA_TYPE;
        }

        // merge in any arguments or kws that dont exist
        const ags = Object.keys(routine.args);
        for (let z = 0; z < ags.length; z++) {
          if (
            !(
              ags[z].toLowerCase() in
              FUNCTION_METHOD_TYPE_OVERRIDES[useName].args
            )
          ) {
            FUNCTION_METHOD_TYPE_OVERRIDES[useName].args[ags[z].toLowerCase()] =
              { direction: DEFAULT_DIRECTION, type: DEFAULT_DATA_TYPE };
          }
        }

        // merge in any arguments or kws that dont exist
        const kws = Object.keys(routine.keywords);
        for (let z = 0; z < kws.length; z++) {
          if (
            !(
              kws[z].toLowerCase() in
              FUNCTION_METHOD_TYPE_OVERRIDES[useName].kws
            )
          ) {
            FUNCTION_METHOD_TYPE_OVERRIDES[useName].kws[kws[z].toLowerCase()] =
              { direction: DEFAULT_DIRECTION, type: DEFAULT_DATA_TYPE };
          }
        }

        // save to revisit if needed
        if (!(splitName[0] in STRUCTURES)) {
          ADD_STRUCTURES[splitName[0]] = {
            display: name.split('::')[0],
            source,
          };
        }

        if (!(useName in FUNCTION_METHOD_SKIPS)) {
          // make our global token
          const token: IGlobalIndexedToken<GlobalFunctionMethodToken> = {
            type: GLOBAL_TOKEN_TYPES.FUNCTION_METHOD,
            name: useName,
            pos: [0, 0, 0],
            meta: {
              display: MethodDisplayName(name),
              className: splitName[0],
              method: splitName[1],
              source: source,
              docs: '',
              private: false,
              returns:
                FUNCTION_METHOD_OVERRIDE[useName]?.returns ||
                ParseIDLType(
                  isClass
                    ? useName
                    : FUNCTION_METHOD_TYPE_OVERRIDES[useName]?.returns ||
                        DEFAULT_DATA_TYPE
                ),
              args: MergeEntries(
                routine.args,
                FUNCTION_METHOD_OVERRIDE[useName]?.args || {},
                FUNCTION_METHOD_TYPE_OVERRIDES[useName]?.args || {}
              ),
              kws: MergeEntries(
                routine.keywords,
                FUNCTION_METHOD_OVERRIDE[useName]?.kws || {},
                FUNCTION_METHOD_TYPE_OVERRIDES[useName]?.kws || {}
              ),
              docsLookup: routine.docs,
              struct: [],
            },
          };

          // check for ENVI keyword
          if (enviClass) {
            if ('error' in token.meta.kws) {
              const err = token.meta.kws['error'];
              err.direction = ENVI_ERROR_KEYWORD.direction;
              err.type = ENVI_ERROR_KEYWORD.type;
            }
          }

          // make fancy docs for our routine
          token.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
            name: token.meta.display,
            meta: token.meta,
            link: url,
          });

          // save URL
          routine.docs['url'] = url;

          // save token
          global.push(token);
        }
      }
      break;
    case GLOBAL_TOKEN_TYPES.PROCEDURE: {
      // populate function values in type overrides
      if (!(useName in PROCEDURE_TYPE_OVERRIDES)) {
        PROCEDURE_TYPE_OVERRIDES[useName] = {
          args: {},
          kws: {},
        };
      }

      // merge in any arguments or kws that dont exist
      const ags = Object.keys(routine.args);
      for (let z = 0; z < ags.length; z++) {
        if (!(ags[z].toLowerCase() in PROCEDURE_TYPE_OVERRIDES[useName].args)) {
          PROCEDURE_TYPE_OVERRIDES[useName].args[ags[z].toLowerCase()] = {
            direction: DEFAULT_DIRECTION,
            type: DEFAULT_DATA_TYPE,
          };
        }
      }

      // merge in any arguments or kws that dont exist
      const kws = Object.keys(routine.keywords);
      for (let z = 0; z < kws.length; z++) {
        if (!(kws[z].toLowerCase() in PROCEDURE_TYPE_OVERRIDES[useName].kws)) {
          PROCEDURE_TYPE_OVERRIDES[useName].kws[kws[z].toLowerCase()] = {
            direction: DEFAULT_DIRECTION,
            type: DEFAULT_DATA_TYPE,
          };
        }
      }

      if (!(useName in PROCEDURE_SKIPS)) {
        // make our global token
        const token: IGlobalIndexedToken<GlobalProcedureToken> = {
          type: GLOBAL_TOKEN_TYPES.PROCEDURE,
          name: useName,
          pos: [0, 0, 0],
          meta: {
            display: name,
            source: source,
            docs: '',
            private: false,
            args: MergeEntries(
              routine.args,
              PROCEDURE_OVERRIDE[useName]?.args || {},
              PROCEDURE_TYPE_OVERRIDES[useName]?.args || {}
            ),
            kws: MergeEntries(
              routine.keywords,
              PROCEDURE_OVERRIDE[useName]?.kws || {},
              PROCEDURE_TYPE_OVERRIDES[useName]?.kws || {}
            ),
            docsLookup: routine.docs,
            struct: [],
          },
        };

        // check for ENVI keyword
        if (enviClass) {
          if ('error' in token.meta.kws) {
            const err = token.meta.kws['error'];
            err.direction = ENVI_ERROR_KEYWORD.direction;
            err.type = ENVI_ERROR_KEYWORD.type;
          }
        }

        // make fancy docs for our routine
        token.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
          name,
          meta: token.meta,
          link: url,
        });

        // save URL
        routine.docs['url'] = url;

        // check if we need to clean
        if (useName in PROCEDURE_CLEANERS) {
          PROCEDURE_CLEANERS[useName](token);
        }

        // save token
        global.push(token);
      }
      break;
    }
    case GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD: {
      const splitName = useName.split('::');

      // populate function values in type overrides
      if (!(useName in PROCEDURE_METHOD_TYPE_OVERRIDES)) {
        PROCEDURE_METHOD_TYPE_OVERRIDES[useName] = {
          args: {},
          kws: {},
        };
      }

      // merge in any arguments or kws that dont exist
      const ags = Object.keys(routine.args);
      for (let z = 0; z < ags.length; z++) {
        if (
          !(
            ags[z].toLowerCase() in
            PROCEDURE_METHOD_TYPE_OVERRIDES[useName].args
          )
        ) {
          PROCEDURE_METHOD_TYPE_OVERRIDES[useName].args[ags[z].toLowerCase()] =
            { direction: DEFAULT_DIRECTION, type: DEFAULT_DATA_TYPE };
        }
      }

      // merge in any arguments or kws that dont exist
      const kws = Object.keys(routine.keywords);
      for (let z = 0; z < kws.length; z++) {
        if (
          !(
            kws[z].toLowerCase() in PROCEDURE_METHOD_TYPE_OVERRIDES[useName].kws
          )
        ) {
          PROCEDURE_METHOD_TYPE_OVERRIDES[useName].kws[kws[z].toLowerCase()] = {
            direction: DEFAULT_DIRECTION,
            type: DEFAULT_DATA_TYPE,
          };
        }
      }

      // save to revisit if needed
      if (!(splitName[0] in STRUCTURES)) {
        ADD_STRUCTURES[splitName[0]] = {
          display: name.split('::')[0],
          source,
        };
      }

      if (!(useName in PROCEDURE_METHOD_SKIPS)) {
        // make our global token
        const token: IGlobalIndexedToken<GlobalProcedureMethodToken> = {
          type: GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
          name: useName,
          pos: [0, 0, 0],
          meta: {
            display: MethodDisplayName(name),
            className: splitName[0],
            method: splitName[1],
            source: source,
            docs: '',
            private: false,
            args: MergeEntries(
              routine.args,
              PROCEDURE_METHOD_OVERRIDE[useName]?.args || {},
              PROCEDURE_METHOD_TYPE_OVERRIDES[useName]?.args || {}
            ),
            kws: MergeEntries(
              routine.keywords,
              PROCEDURE_METHOD_OVERRIDE[useName]?.kws || {},
              PROCEDURE_METHOD_TYPE_OVERRIDES[useName]?.kws || {}
            ),
            docsLookup: routine.docs,
            struct: [],
          },
        };

        // check for ENVI keyword
        if (enviClass) {
          if ('error' in token.meta.kws) {
            const err = token.meta.kws['error'];
            err.direction = ENVI_ERROR_KEYWORD.direction;
            err.type = ENVI_ERROR_KEYWORD.type;
          }
        }

        // make fancy docs for our routine
        token.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
          name: token.meta.display,
          meta: token.meta,
          link: url,
        });

        // save URL
        routine.docs['url'] = url;

        // save token
        global.push(token);
      }
      break;
    }
    case GLOBAL_TOKEN_TYPES.STRUCTURE:
      // do nothing since it is handled below
      break;
    case GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE: {
      const token: IGlobalIndexedToken<GlobalSystemVariableToken> = {
        type: GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE,
        name: useName,
        pos: [0, 0, 0],
        meta: {
          display: name,
          source: source,
          docs: DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.GENERAL, routine.docs),
          type: ParseIDLType(name),
          private: false,
        },
      };
      global.push(token);
      break;
    }
    default:
      throw new Error(`Unhandled parsed type of "${r.type}"`);
  }

  /**
   * Get inheritance guesses which means we should force adding a class
   */
  const inheritanceGuess = InheritanceGuess(useName);

  /**
   * Check for structure definition as well (i.e. we parsed properties) from the same file which
   * is primarily a pattern for the ENVI API
   */
  if ((hasProps && !(useName in STRUCTURES)) || inheritanceGuess.length > 0) {
    // populate function values in type overrides
    if (!(useName in IDL_STRUCTURE_TYPE_OVERRIDES)) {
      IDL_STRUCTURE_TYPE_OVERRIDES[useName] = {
        properties: {},
      };
    }

    // merge in any arguments or kws that dont exist
    const props = Object.keys(routine.properties);
    for (let z = 0; z < props.length; z++) {
      if (!(props[z] in IDL_STRUCTURE_TYPE_OVERRIDES[useName].properties)) {
        IDL_STRUCTURE_TYPE_OVERRIDES[useName].properties[
          props[z].toLowerCase()
        ] = { direction: 'bidirectional', type: DEFAULT_DATA_TYPE };
      }
    }

    if (!(useName in STRUCTURE_SKIPS) && !useName.includes('::')) {
      // initialize our metadata
      const struct: IGlobalIndexedToken<GlobalStructureToken> = {
        type: GLOBAL_TOKEN_TYPES.STRUCTURE,
        name: useName,
        pos: [0, 0, 0],
        meta: {
          display: StructureDisplayName(
            name,
            STRUCTURE_OVERRIDE[useName] || {}
          ),
          source: source,
          docs: DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.GENERAL, routine.docs),
          inherits: inheritanceGuess,
          props: MergeEntries(
            routine.properties || {},
            STRUCTURE_OVERRIDE[useName]?.properties || {},
            IDL_STRUCTURE_TYPE_OVERRIDES[useName]?.properties || {}
          ),
        },
      };

      // save our structure in the global tokens
      global.push(struct);

      // save that we processed this structure already
      STRUCTURES[useName] = true;

      // clean up that we have added our structure
      delete ADD_STRUCTURES[useName];
    }
  }
}

/**
 * Adds any missing struct to our global lookup where we don't
 * have hard-coded docs, but we found methods for the class
 */
export function RoutineToGlobalAddMissingStructures(global: GlobalTokens) {
  const keys = Object.keys(ADD_STRUCTURES);
  for (let i = 0; i < keys.length; i++) {
    // skip if not a real structure
    if (keys[i].includes('::')) {
      continue;
    }

    // initialize our metadata
    const struct: IGlobalIndexedToken<GlobalStructureToken> = {
      type: GLOBAL_TOKEN_TYPES.STRUCTURE,
      name: keys[i],
      pos: [0, 0, 0],
      meta: {
        display: StructureDisplayName(
          ADD_STRUCTURES[keys[i]].display,
          STRUCTURE_OVERRIDE[keys[i]] || {}
        ),
        source: ADD_STRUCTURES[keys[i]].source,
        docs: '',
        inherits: InheritanceGuess(keys[i]),
        props: MergeEntries(
          {},
          STRUCTURE_OVERRIDE[keys[i]]?.properties || {},
          IDL_STRUCTURE_TYPE_OVERRIDES[keys[i]]?.properties || {}
        ),
      },
    };

    // save our structure in the global tokens
    global.push(struct);

    // save that we processed this structure already
    STRUCTURES[keys[i]] = true;

    // clean up that we have added our structure
    delete ADD_STRUCTURES[keys[i]];
  }
}
