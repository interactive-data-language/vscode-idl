import {
  GLOBAL_TOKEN_TYPES,
  GlobalTokenType,
  IGlobalIndexedToken,
} from '@idl/data-types/core';
import { IParsed } from '@idl/parsing/syntax-tree';
import { DocumentSymbol } from 'vscode-languageserver';

import {
  DEFAULT_OUTLINE_SYMBOL_KIND,
  OUTLINE_THESE_TOKENS,
  OUTLINE_TOKEN_KIND_MAP,
} from './parser-get-outline.interface';

/**
 * Given a global token, returns the display name to be shown in the outline in VSCode
 */
export function OutlineDisplayName(
  token: IGlobalIndexedToken<GlobalTokenType>
): string {
  switch (token.type) {
    case GLOBAL_TOKEN_TYPES.FUNCTION:
      return `${token.meta.display}()`;
    case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
      return `${token.meta.display}()`;
    default:
      return token.meta.display;
  }
}

/**
 * Generates the outline for a PRO file
 */
export async function ParserGetOutline(parsed: IParsed) {
  // get our global tokens
  const global = parsed.global;

  // initialize object to track global tokens
  // only track a single token per line which matches IDL where you cant declare
  // more than one routine on the same line
  const tracked: { [key: number]: DocumentSymbol } = {};

  // process our global tokens
  for (let i = 0; i < global.length; i++) {
    // extract global token
    const globali = global[i];

    // check if we need to save
    if (globali.type in OUTLINE_THESE_TOKENS) {
      tracked[globali.pos[0]] = {
        kind:
          globali.type in OUTLINE_TOKEN_KIND_MAP
            ? OUTLINE_TOKEN_KIND_MAP[globali.type]
            : DEFAULT_OUTLINE_SYMBOL_KIND,
        name: OutlineDisplayName(globali),
        range: {
          start: {
            line: globali.pos[0],
            character: globali.pos[1],
          },
          end: {
            line: globali.pos[0],
            character: globali.pos[1] + globali.pos[2],
          },
        },
        selectionRange: {
          start: {
            line: globali.pos[0],
            character: globali.pos[1],
          },
          end: {
            line: globali.pos[0],
            character: globali.pos[1] + globali.pos[2],
          },
        },
      };
    }
  }

  // order by appearance
  const lines = Object.keys(tracked).sort();
  const found: DocumentSymbol[] = [];
  for (let i = 0; i < lines.length; i++) {
    found.push(tracked[lines[i]]);
  }

  // add to outline
  parsed.outline = found;
}
