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

import { FindKeyword } from '../../helpers/get-keyword';
import { GetKeywordDisplayName } from '../../helpers/get-keyword-display-name';
import { GetKeywords } from '../../helpers/get-keywords';
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
  // track if we find keywords
  let set = false;

  // get matching keywords for our token
  const found = GetKeywords(index, parsed, token, false);

  // did we find an item?
  if (found) {
    // get the keyword name to check for
    const displayName = GetKeywordDisplayName(token);
    const name = displayName.toLowerCase();

    /**
     * Find our keyword
     */
    const kw = FindKeyword(name, found.keywords);

    // check if we have a keyword
    if (kw !== undefined) {
      set = true;
      lookup.type = found.global.type;
      lookup.name = found.global.name;
      lookup.kw = kw.display;
    }
  }

  if (!set) {
    lookup.contents = IDLTypeHelper.addTypeToDocs(
      GetKeywordDisplayName(token),
      IDL_TRANSLATION.lsp.types.unknown.keyword,
      IDLTypeHelper.parseIDLType(IDL_TYPE_LOOKUP.ANY),
      'kw',
    );
  }
}
