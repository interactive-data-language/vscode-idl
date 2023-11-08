import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
  ParseIDLType,
} from '@idl/data-types/core';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  Command,
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for function methods
 */
const FUNCTION_METHODS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD];

/**
 * Adds variables to our completion items
 */
function AddCompletionFunctionMethodsForType(
  complete: CompletionItem[],
  index: IDLIndex,
  formatting: IAssemblerOptions<FormatterType>,
  type: IDLDataTypeBase<IDLTypes>,
  addParen: boolean,
  found: { [key: string]: any } = {}
) {
  /** If we add parentheses or not */
  const add = addParen ? '()' : '';

  /** Cursor movement command */
  const command: Command = {
    title: 'Cursor Adjust',
    command: addParen ? 'cursorLeft' : 'cursorRight',
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
        AddCompletionFunctionMethods(
          complete,
          index,
          formatting,
          ParseIDLType(inherits[i]),
          addParen,
          found
        );
      }
    }
  }
}

/**
 * Adds variables to our completion items
 */
export function AddCompletionFunctionMethods(
  complete: CompletionItem[],
  index: IDLIndex,
  formatting: IAssemblerOptions<FormatterType>,
  type: IDLDataType,
  addParen: boolean,
  found: { [key: string]: any } = {}
) {
  // process each type
  for (let i = 0; i < type.length; i++) {
    AddCompletionFunctionMethodsForType(
      complete,
      index,
      formatting,
      type[i],
      addParen,
      found
    );
  }
}
