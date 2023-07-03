import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import {
  IDL_TYPE_LOOKUP,
  IDLTypeHelper,
  IParameterLookup,
} from '@idl/data-types/core';
import {
  FindDirectBranchChildren,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { FindKeyword } from '../../helpers/get-keyword';
import { GetKeywords } from '../../helpers/get-keywords';
import {
  CALL_ROUTINE_TOKENS,
  CallRoutineToken,
} from '../../helpers/get-keywords.interface';
import { IDLIndex } from '../../idl-index.class';
import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * If we encounter these tokens, remove the "/" for boolean keywords
 */
const BINARY_TOKEN_CHECK: { [key: string]: any } = {};
BINARY_TOKEN_CHECK[TOKEN_NAMES.OPERATOR] = true;
BINARY_TOKEN_CHECK[TOKEN_NAMES.KEYWORD_BINARY] = true;

/**
 * Adds keyword completion keywords to functions
 */
export function AddCompletionKeywords(
  complete: CompletionItem[],
  parsed: IParsed,
  index: IDLIndex,
  token: TreeToken<TokenName>,
  formatting: IAssemblerOptions<FormatterType>
) {
  /**
   * Best-guess keywords
   */
  const keywords = GetKeywords(index, parsed, token);

  // find the right parent
  let local: CallRoutineToken =
    token.name in CALL_ROUTINE_TOKENS ? (token as CallRoutineToken) : undefined;

  // check if we need to search up our scop eto find a place where keywords
  // could come from
  if (local === undefined) {
    for (let i = token.scopeTokens.length - 1; i > 0; i--) {
      if (token.scopeTokens[i].name in CALL_ROUTINE_TOKENS) {
        local = token.scopeTokens[i] as CallRoutineToken;
        break;
      }
    }
  }

  // check if our immediate parent is "/"
  let binaryAdd = '/';
  let forceBinary = false;
  if (token.name in BINARY_TOKEN_CHECK) {
    if (token.match[0].trim().startsWith('/')) {
      binaryAdd = '';
      forceBinary = true;
    }
  }

  // get our defined keywords
  const defined: IParameterLookup =
    keywords !== undefined ? keywords.keywords : {};

  // get local keywords - check if we have
  const used =
    local === undefined
      ? []
      : FindDirectBranchChildren(local, TOKEN_NAMES.KEYWORD)
          .map(
            (kw) =>
              FindKeyword(
                kw.match[0].toLowerCase(),
                defined,
                true
              )?.display.toLowerCase() || kw.match[0].toLowerCase()
          )
          .concat(
            FindDirectBranchChildren(local, TOKEN_NAMES.KEYWORD_BINARY).map(
              (kw) =>
                FindKeyword(
                  kw.match[0].toLowerCase().substring(1),
                  defined,
                  true
                )?.display.toLowerCase() ||
                kw.match[0].toLowerCase().substring(1)
            )
          );

  // add all of our defined keywords
  const kws = Object.keys(defined);
  for (let i = 0; i < kws.length; i++) {
    // make sure we havent used it already
    if (used.indexOf(kws[i]) === -1) {
      // get keyword
      const kw = defined[kws[i]];

      // get display name of our keyword
      const display = AdjustCase(kw.display, formatting.style.keywords);

      // add keyword
      complete.push({
        label: display + ' = ',
        insertText:
          forceBinary || IDLTypeHelper.isType(kw.type, IDL_TYPE_LOOKUP.BOOLEAN)
            ? binaryAdd + display
            : display + ' = ',
        kind: CompletionItemKind.EnumMember,
        sortText: SORT_PRIORITY.KEYWORDS,
        detail: IDL_TRANSLATION.autoComplete.detail.keyword,
        documentation: kw.docs,
      });
    }
  }
}
