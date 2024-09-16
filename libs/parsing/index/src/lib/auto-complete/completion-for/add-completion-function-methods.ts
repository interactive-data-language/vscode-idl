import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
  ParseIDLType,
} from '@idl/types/core';
import {
  Command,
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { SORT_PRIORITY } from '../sort-priority.interface';
import { IFunctionMethodCompletionOptions } from './add-completion-function-methods.interface';

/**
 * Display names for function methods
 */
const FUNCTION_METHODS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD];

/**
 * Adds variables to our completion items
 */
function AddCompletionFunctionMethodsForType(
  complete: CompletionItem[],
  options: IFunctionMethodCompletionOptions,
  formatting: IAssemblerOptions<FormatterType>,
  index: IDLIndex,
  type: IDLDataTypeBase<IDLTypes>,
  found: { [key: string]: any } = {}
) {
  /** If we add parentheses or not */
  const add = options.addParen ? '()' : '';

  /** Cursor movement command */
  const command: Command = {
    title: 'Cursor Adjust',
    command: options.addParen ? 'cursorLeft' : 'cursorRight',
  };

  /**
   * If our type is any, just send all methods
   */
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    const displayNames = Object.values(FUNCTION_METHODS);
    for (let i = 0; i < displayNames.length; i++) {
      complete.push({
        label: displayNames[i] + '()',
        insertText:
          TransformCase(
            displayNames[i].split('::')[1],
            formatting.style.routineMethods
          ) + add,
        kind: CompletionItemKind.Method,
        sortText: SORT_PRIORITY.METHODS,
        detail: IDL_TRANSLATION.autoComplete.detail.functionMethod,
        command,
      });
    }
    return;
  }

  /** Lower-case string to compare against our methods */
  const compareType = type.name.toLowerCase() + '::';

  // build cache for internal
  const names = Object.keys(FUNCTION_METHODS);
  for (let i = 0; i < names.length; i++) {
    const methodName = names[i].split('::')[1];
    if (
      names[i].startsWith(compareType) &&
      !(methodName in found) &&
      !(methodName === 'init')
    ) {
      complete.push({
        label: FUNCTION_METHODS[names[i]] + '()',
        insertText:
          TransformCase(
            FUNCTION_METHODS[names[i]].split('::')[1],
            formatting.style.routineMethods
          ) + add,
        kind: CompletionItemKind.Method,
        sortText: SORT_PRIORITY.METHODS,
        detail: IDL_TRANSLATION.autoComplete.detail.functionMethod,
        command,
      });
      found[methodName] = true;
    }
  }

  // check for global token
  const global = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    type.name.toLocaleLowerCase()
  );
  if (global.length > 0) {
    // check if we have inheritance to consider
    const inherits = global[0].meta.inherits;
    if (inherits.length > 0) {
      for (let i = 0; i < inherits.length; i++) {
        BuildCompileOptCompletionItems(
          complete,
          {
            addParen: options.addParen,
            type: ParseIDLType(inherits[i]),
          },
          formatting,
          index,
          found
        );
      }
    }
  }
}

/**
 * Creates options for creating auto-complete
 */
export function BuildFunctionMethodCompletionOptions(
  type: IDLDataType,
  addParen: boolean
): IFunctionMethodCompletionOptions {
  return {
    addParen,
    type,
  };
}

/**
 * Adds variables to our completion items
 */
export function BuildCompileOptCompletionItems(
  complete: CompletionItem[],
  options: IFunctionMethodCompletionOptions,
  formatting: IAssemblerOptions<FormatterType>,
  index: IDLIndex,
  found: { [key: string]: any } = {}
) {
  // process each type
  for (let i = 0; i < options.type.length; i++) {
    AddCompletionFunctionMethodsForType(
      complete,
      options,
      formatting,
      index,
      options.type[i],
      found
    );
  }
}
