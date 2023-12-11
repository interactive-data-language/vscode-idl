import {
  GLOBAL_TOKEN_TYPES,
  GlobalRoutineToken,
  GlobalStructureToken,
  GlobalTokenType,
  IGlobalIndexedToken,
} from '@idl/data-types/core';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_COMMANDS } from '@idl/shared';
import { IRetrieveDocsPayload } from '@idl/vscode/events/messages';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { Hover } from 'vscode-languageserver';

import { ResolveHoverHelpLinks } from '../helpers/resolve-hover-help-links';
import { IDLIndex } from '../idl-index.class';
import { IHoverHelpLookup } from './hover-help-lookup.interface';

/** Allowed local parents for attempting to find keyword definition information */
const KW_DEF: { [key: string]: boolean } = {};
KW_DEF[TOKEN_NAMES.ROUTINE_NAME] = true;
KW_DEF[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Routine global types
 */
export const ROUTINE_GLOBAL_TYPES: { [key: string]: boolean } = {};
ROUTINE_GLOBAL_TYPES[GLOBAL_TOKEN_TYPES.FUNCTION] = true;
ROUTINE_GLOBAL_TYPES[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD] = true;
ROUTINE_GLOBAL_TYPES[GLOBAL_TOKEN_TYPES.PROCEDURE] = true;
ROUTINE_GLOBAL_TYPES[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD] = true;

/**
 * Returns text for hover help
 */
export async function GetHoverHelpFromLookup(
  index: IDLIndex,
  lookup: IHoverHelpLookup<GlobalTokenType>,
  config: IDLExtensionConfig
): Promise<Hover> {
  /**
   * Init hover response
   */
  const hover: Hover = {
    contents: '',
    range: {
      start: {
        line: lookup.pos[0],
        character: lookup.pos[1],
      },
      end: {
        line: lookup.pos[0],
        character: lookup.pos[1] + lookup.pos[2],
      },
    },
  };

  /**
   * See what our response was
   */
  switch (true) {
    /**
     * Did we have the raw strings?
     */
    case lookup.content !== undefined:
      hover.contents = lookup.content;
      break;
    /**
     * Do we have a routine
     */
    case lookup.type !== undefined && lookup.name !== undefined: {
      /**
       * Find matching global token
       */
      const globals = index.globalIndex.findMatchingGlobalToken(
        lookup.type,
        lookup.name
      );

      /**
       * Make sure we found a match
       */
      if (globals.length > 0) {
        /**
         * Get first match
         */
        const global = globals[0];

        /**
         * Placeholder for help content
         */
        let help = '';

        /**
         * Check how we proceed
         */
        switch (true) {
          /**
           * Argument
           */
          case lookup.arg !== undefined && lookup.type in ROUTINE_GLOBAL_TYPES:
            help = (global as GlobalRoutineToken).meta.args[lookup.arg].docs;
            break;
          /**
           * Keyword
           */
          case lookup.kw !== undefined && lookup.type in ROUTINE_GLOBAL_TYPES:
            help = (global as GlobalRoutineToken).meta.kws[lookup.arg].docs;
            break;
          /**
           * Property
           */
          case lookup.prop !== undefined &&
            lookup.type === GLOBAL_TOKEN_TYPES.STRUCTURE:
            help = (global as IGlobalIndexedToken<GlobalStructureToken>).meta
              .props[lookup.prop].docs;
            break;
          default:
            help = global.meta.docs;
            break;
        }

        /**
         * Check if we have help
         */
        if (help !== '') {
          // resolve links in hover help
          help = ResolveHoverHelpLinks(help, config);

          // check if we have a matching global token to open in a notebook
          if (lookup.type in ROUTINE_GLOBAL_TYPES) {
            // split
            const split = help.split(/\n/g);

            // create info for docs
            const info: IRetrieveDocsPayload = {
              type: global.type,
              name: global.meta.display,
            };

            /**
             * Make command to open in notebook
             */
            const cmd = `[Open Examples in Notebook](command:${
              IDL_COMMANDS.NOTEBOOKS.HELP_AS_NOTEBOOK
            }?${encodeURI(JSON.stringify(info))})`;

            // check how our docs are formatted (do we have a link to docs or not)
            if (split[0].startsWith('[')) {
              split[0] = `${split[0]} | ${cmd}`;
            } else {
              split.unshift(cmd);
            }

            // join help back together
            help = split.join('\n');
          }
        }

        // set content
        hover.contents = help;
      }
      break;
    }
    /**
     * Do nothing, unhandled case
     */
    default:
      break;
  }

  // return hover
  return hover;
}
