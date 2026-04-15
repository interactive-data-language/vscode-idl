import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  KeywordBinaryToken,
  KeywordDefinitionToken,
  KeywordToken,
} from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_TYPE_LOOKUP } from '@idl/types/idl-data-types';
import { IParsed, TreeToken } from '@idl/types/syntax-tree';
import { GetHoverHelpLookupResponse } from '@idl/workers/parsing';

import { GetKeyword } from '../../helpers/get-keyword';
import { GetKeywordDisplayName } from '../../helpers/get-keyword-display-name';
import { IDLIndex } from '../../idl-index.class';

/**
 * Returns hover help for a routine that is being called
 *
 * Specifically, it is tokens in our code such as call procedure  or call
 * function
 */
export function GetKeywordHoverHelp(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<KeywordBinaryToken | KeywordDefinitionToken | KeywordToken>,
  lookup: GetHoverHelpLookupResponse,
) {
  // get the keyword
  const kw = GetKeyword(index, parsed, token, false);

  // check if we have a keyword
  if (kw !== undefined) {
    lookup.type = kw.globalType;
    lookup.name = kw.globalName;
    lookup.kw = kw.display;
  } else {
    lookup.contents = IDLTypeHelper.addTypeToDocs(
      GetKeywordDisplayName(token),
      IDL_TRANSLATION.lsp.types.unknown.keyword,
      IDLTypeHelper.parseIDLType(IDL_TYPE_LOOKUP.ANY),
      'kw',
    );
  }
}
