import {
  GLOBAL_TOKEN_TYPES,
  IDL_ANY_TYPE,
  IDLTypeHelper,
} from '@idl/data-types/core';
import { TreeToken } from '@idl/parsing/syntax-tree';
import { SystemVariableToken } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';

import { IDLIndex } from '../../idl-index.class';

/**
 * Returns hover help for system variables
 */
export function GetSysVarHoverHelp(
  index: IDLIndex,
  token: TreeToken<SystemVariableToken>
): string {
  let help = '';

  // search for global tokens
  const global = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE,
    token.match[0]
  );

  // check if we found a token
  if (global.length > 0) {
    help = global[0].meta.docs;
  } else {
    // default to the name, nothing fancy
    help = IDLTypeHelper.addTypeToDocs(
      `SystemVariable<${token.match[0].substring(1)}>`,
      IDL_TRANSLATION.lsp.types.unknown.sysVar,
      IDL_ANY_TYPE
    );
  }

  return help;
}
