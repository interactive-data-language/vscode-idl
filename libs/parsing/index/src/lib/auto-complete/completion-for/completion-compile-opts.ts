import { AdjustCase } from '@idl/assembling/shared';
import { TreeToken } from '@idl/parsing/syntax-tree';
import { ALLOWED_COMPILE_OPTIONS } from '@idl/parsing/syntax-validators';
import { ControlCompileOptToken, TOKEN_NAMES } from '@idl/tokenizer';
import {
  CompileOptCompletion,
  ICompileOptCompletionOptions,
} from '@idl/types/auto-complete';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';

/**
 * Generates options for creating compile opts
 */
export function GetCompileOptCompletionOptions(
  token: TreeToken<ControlCompileOptToken>
): ICompileOptCompletionOptions {
  return {
    current: token.kids
      .filter((kid) => kid.name === TOKEN_NAMES.CONTROL_OPTION)
      .map((kid) => kid.match[0].toLowerCase().trim()),
  };
}

/**
 * Generates completion items from our options
 */
export function BuildCompileOptCompletionItems(
  arg: BuildCompletionItemsArg<CompileOptCompletion>
) {
  // get current compile opts
  const opts = arg.options.current;

  // get compile opts we should add in
  const addOpts = Object.keys(ALLOWED_COMPILE_OPTIONS).filter(
    (opt) => opts.indexOf(opt) === -1
  );

  // add user procedures first
  for (let i = 0; i < addOpts.length; i++) {
    arg.complete.push({
      label: AdjustCase(addOpts[i], arg.formatting.style.control),
      kind: CompletionItemKind.EnumMember,
      sortText: COMPLETION_SORT_PRIORITY.CONTROL,
    });
  }
}
