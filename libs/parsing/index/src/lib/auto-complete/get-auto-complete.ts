import type { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import type { IDLExtensionConfig } from '@idl/vscode/extension-config';
import type { GetAutoCompleteResponse } from '@idl/workers/parsing';
import type { Position } from 'vscode-languageserver-types';

import type { IDLIndex } from '../idl-index.class';
import { BuildCompletionItems } from './build-completion-items';
import { GetCompletionRecipes } from './get-completion-recipes';

/**
 * Returns text for hover help
 */
export async function GetAutoComplete(
  index: IDLIndex,
  file: string,
  code: string | string[],
  position: Position,
  config: IDLExtensionConfig,
  formatting: IAssemblerOptions<FormatterType>,
): Promise<GetAutoCompleteResponse> {
  // get completion recipes
  const recipes = await GetCompletionRecipes(index, file, code, position);

  // build completion items
  return BuildCompletionItems(index, recipes, config, formatting);
}
