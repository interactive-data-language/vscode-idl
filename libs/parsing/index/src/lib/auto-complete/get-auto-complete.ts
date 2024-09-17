import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { GetAutoCompleteResponse } from '@idl/workers/parsing';
import { Position } from 'vscode-languageserver/node';

import { IDLIndex } from '../idl-index.class';
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
  formatting: IAssemblerOptions<FormatterType>
): Promise<GetAutoCompleteResponse> {
  // get completion recipes
  const recipes = await GetCompletionRecipes(index, file, code, position);

  // build completion items
  return BuildCompletionItems(index, recipes, formatting, config);
}
