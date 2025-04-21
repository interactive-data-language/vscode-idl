import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { GetSortIndexForStrings } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IFunctionMethodCompletionOptions } from '@idl/types/auto-complete';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
  ParseIDLType,
} from '@idl/types/core';
import { Command, CompletionItemKind } from 'vscode-languageserver';

import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';
import { IFunctionMethodCompletionArg } from './completion-function-methods.interface';

/**
 * Display names for function methods
 */
const FUNCTION_METHODS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD];

/**
 * Adds variables to our completion items
 */
function BuildFunctionMethodCompletionItemsForType(
  arg: IFunctionMethodCompletionArg,
  type: IDLDataTypeBase<IDLTypes>
) {
  /** If we add parentheses or not */
  const add = arg.options.addParen ? '()' : '';

  /** Cursor movement command */
  const command: Command = {
    title: 'Cursor Adjust',
    command: arg.options.addParen ? 'cursorLeft' : 'cursorRight',
  };

  /**
   * If our type is any, just send all methods
   */
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    const displayNames = Object.values(FUNCTION_METHODS);
    for (let i = 0; i < displayNames.length; i++) {
      arg.complete.push({
        label: displayNames[i] + '()',
        insertText:
          TransformCase(
            displayNames[i].split('::')[1],
            arg.formatting.style.routineMethods
          ) + add,
        kind: CompletionItemKind.Method,
        sortText: COMPLETION_SORT_PRIORITY.METHODS,
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
      !(methodName in arg.found) &&
      !(methodName === 'init')
    ) {
      arg.complete.push({
        label: FUNCTION_METHODS[names[i]] + '()',
        insertText:
          TransformCase(
            FUNCTION_METHODS[names[i]].split('::')[1],
            arg.formatting.style.routineMethods
          ) + add,
        kind: CompletionItemKind.Method,
        sortText: COMPLETION_SORT_PRIORITY.METHODS,
        detail: IDL_TRANSLATION.autoComplete.detail.functionMethod,
        command,
      });
      arg.found[methodName] = true;
    }
  }

  // check for global token
  const global = arg.index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    type.name.toLocaleLowerCase()
  );
  if (global.length > 0) {
    // check if we have inheritance to consider
    const inherits = global[0].meta.inherits;
    if (inherits.length > 0) {
      for (let i = 0; i < inherits.length; i++) {
        BuildFunctionMethodCompletionItems({
          ...arg,
          ...{
            options: {
              addParen: arg.options.addParen,
              type: ParseIDLType(inherits[i]),
            },
          },
        });
      }
    }
  }
}

/**
 * Creates options for creating auto-complete
 */
export function GetFunctionMethodCompletionOptions(
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
export function BuildFunctionMethodCompletionItems(
  arg: IFunctionMethodCompletionArg
) {
  // track found if we dont have it
  if (!arg.found) {
    arg.found = {};
  }

  // save original complete
  const complete = arg.complete;

  // set for only properties since we recurse
  arg.complete = [];

  // process each type
  for (let i = 0; i < arg.options.type.length; i++) {
    BuildFunctionMethodCompletionItemsForType(arg, arg.options.type[i]);
  }

  /**
   * Sort based on the label
   *
   * Since this is recursive based on types and inheritance, we do it at this level
   */
  const idxSorted = GetSortIndexForStrings(
    arg.complete.map((item) => item.label)
  );

  // merge while perserving original array reference
  for (let i = 0; i < idxSorted.length; i++) {
    complete.push(arg.complete[idxSorted[i]]);
  }

  // combine items
  arg.complete = complete;
}
