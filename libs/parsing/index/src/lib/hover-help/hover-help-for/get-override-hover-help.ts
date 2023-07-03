import { IsWithinToken, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';
import { Position } from 'vscode-languageserver';

/**
 * If we have hover help overrides for tokens, check and see if we
 * have that to load instead of default values.
 *
 * Use cases for this are when we have docs content and, hovering over
 * specific items, shows custom content
 */
export function GetOverrideHoverHelp(
  token: TreeToken<TokenName>,
  pos: Position
): string {
  let help = '';

  // verify we have override
  if (Array.isArray(token.hoverOverride)) {
    // check each override
    for (let i = 0; i < token.hoverOverride.length; i++) {
      // look for overlap
      if (IsWithinToken(pos, token.hoverOverride[i].pos)) {
        help = token.hoverOverride[i].docs;
        break;
      }
    }
  }

  return help;
}
