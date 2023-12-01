import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { TreeToken } from '@idl/parsing/syntax-tree';
import { ALLOWED_COMPILE_OPTIONS } from '@idl/parsing/syntax-validators';
import { ControlCompileOptToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Adds compile opt completion items
 */
export function AddCompletionCompileOpts(
  complete: CompletionItem[],
  token: TreeToken<ControlCompileOptToken>,
  formatting: IAssemblerOptions<FormatterType>
) {
  // get current compile opts
  const opts = token.kids
    .filter((kid) => kid.name === TOKEN_NAMES.CONTROL_OPTION)
    .map((kid) => kid.match[0].toLowerCase().trim());

  // get compile opts we should add in
  const addOpts = Object.keys(ALLOWED_COMPILE_OPTIONS).filter(
    (opt) => opts.indexOf(opt) === -1
  );

  // add user procedures first
  for (let i = 0; i < addOpts.length; i++) {
    complete.push({
      label: AdjustCase(addOpts[i], formatting.style.control),
      kind: CompletionItemKind.EnumMember,
      sortText: SORT_PRIORITY.CONTROL,
    });
  }
}
