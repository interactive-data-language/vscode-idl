import {
  IDL_ANY_TYPE,
  IDL_STRUCTURE_TYPE,
  IDLTypeHelper,
} from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  AccessPropertyToken,
  StructurePropertyToken,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';

import { GetProperty } from '../../helpers/get-property';
import { GetPropertyDisplayName } from '../../helpers/get-property-display-name';
import { GetPropertyName } from '../../helpers/get-property-name';
import { IDLIndex } from '../../idl-index.class';

/**
 * Returns hover help for properties base don the type
 */
export function GetPropertyHoverHelp(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken | StructurePropertyToken>
): string {
  let help = '';

  // get our property
  const prop = GetProperty(index, parsed, token, false);

  // did we find a property?
  if (prop !== undefined) {
    help = IDLTypeHelper.addTypeToDocs(
      GetPropertyDisplayName(prop.display, prop.class),
      prop.docs,
      prop.type
    );
  } else {
    // default to the name, nothing fancy
    help = IDLTypeHelper.addTypeToDocs(
      GetPropertyDisplayName(GetPropertyName(token), IDL_STRUCTURE_TYPE),
      IDL_TRANSLATION.lsp.types.unknown.property,
      IDL_ANY_TYPE
    );
  }

  return help;
}
