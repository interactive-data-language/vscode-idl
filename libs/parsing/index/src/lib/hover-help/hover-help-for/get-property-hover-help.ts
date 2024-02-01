import { GetPropertyName, IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  AccessPropertyToken,
  StructurePropertyToken,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_ANY_TYPE,
  IDL_STRUCTURE_TYPE,
  IDLTypeHelper,
} from '@idl/types/core';
import { GetHoverHelpLookupResponse } from '@idl/workers/parsing';

import { GetProperty } from '../../helpers/get-property';
import { GetPropertyDisplayName } from '../../helpers/get-property-display-name';
import { IDLIndex } from '../../idl-index.class';

/**
 * Returns hover help for properties base don the type
 */
export function GetPropertyHoverHelp(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken | StructurePropertyToken>,
  lookup: GetHoverHelpLookupResponse
) {
  // get our property
  const prop = GetProperty(index, parsed, token, false);

  // did we find a property?
  if (prop !== undefined) {
    if (prop.globalName.toLowerCase() === 'structure') {
      lookup.contents = IDLTypeHelper.addTypeToDocs(
        GetPropertyDisplayName(prop.display, IDL_STRUCTURE_TYPE),
        '',
        prop.type
      );
    } else {
      lookup.type = GLOBAL_TOKEN_TYPES.STRUCTURE;
      lookup.name = prop.globalName;
      lookup.prop = prop.name;
    }
  } else {
    // default to the name, nothing fancy
    lookup.contents = IDLTypeHelper.addTypeToDocs(
      GetPropertyDisplayName(GetPropertyName(token), IDL_STRUCTURE_TYPE),
      IDL_TRANSLATION.lsp.types.unknown.property,
      IDL_ANY_TYPE
    );
  }
}
