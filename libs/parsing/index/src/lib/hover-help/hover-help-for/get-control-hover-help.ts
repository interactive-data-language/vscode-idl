import { TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';

/**
 * Control tokens that we can provide hover help for with the value as the hover help
 */
export const CONTROL_HELPERS: { [key: string]: string } = {};
CONTROL_HELPERS[TOKEN_NAMES.CONTROL_BREAK] =
  IDL_TRANSLATION.hoverHelp.control.break;
CONTROL_HELPERS[TOKEN_NAMES.LOGICAL_CASE] =
  IDL_TRANSLATION.hoverHelp.control.case;
CONTROL_HELPERS[TOKEN_NAMES.CONTROL_CONTINUE] =
  IDL_TRANSLATION.hoverHelp.control.continue;
CONTROL_HELPERS[TOKEN_NAMES.LOGICAL_ELSE] =
  IDL_TRANSLATION.hoverHelp.control.else;
CONTROL_HELPERS[TOKEN_NAMES.LOOP_FOR] = IDL_TRANSLATION.hoverHelp.control.for;
CONTROL_HELPERS[TOKEN_NAMES.LOOP_FOREACH] =
  IDL_TRANSLATION.hoverHelp.control.foreach;
CONTROL_HELPERS[TOKEN_NAMES.ROUTINE_FUNCTION] =
  IDL_TRANSLATION.hoverHelp.control.function;
CONTROL_HELPERS[TOKEN_NAMES.LOGICAL_IF] = IDL_TRANSLATION.hoverHelp.control.if;
CONTROL_HELPERS[TOKEN_NAMES.ROUTINE_PROCEDURE] =
  IDL_TRANSLATION.hoverHelp.control.pro;
CONTROL_HELPERS[TOKEN_NAMES.LOGICAL_ELSE] =
  IDL_TRANSLATION.hoverHelp.control.else;
CONTROL_HELPERS[TOKEN_NAMES.LOOP_WHILE] =
  IDL_TRANSLATION.hoverHelp.control.while;

/**
 * Give a control token, we return hover help
 */
export function GetControlHoverHelp(token: TreeToken<TokenName>): string {
  if (token.name in CONTROL_HELPERS) {
    return CONTROL_HELPERS[token.name];
  }
  return '';
}
