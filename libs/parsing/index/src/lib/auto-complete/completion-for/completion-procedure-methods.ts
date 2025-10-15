import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { GetSortIndexForStrings } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IProcedureMethodCompletionOptions } from '@idl/types/auto-complete';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
  ParseIDLType,
} from '@idl/types/core';
import { CompletionItemKind } from 'vscode-languageserver';

import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';
import { IProcedureMethodCompletionArg } from './completion-procedure-methods.interface';

/**
 * Display names for procedure methods
 */
const PROCEDURE_METHODS =
  IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD];

/**
 * Adds variables to our completion items
 */
function BuildProcedureMethodCompletionItemsForType(
  arg: IProcedureMethodCompletionArg,
  type: IDLDataTypeBase<IDLTypes>
) {
  /**
   * If we have any type, return everything
   */
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    const displayNames = Object.values(PROCEDURE_METHODS);
    for (let i = 0; i < displayNames.length; i++) {
      arg.complete.push({
        label: displayNames[i],
        insertText: TransformCase(
          displayNames[i].split('::')[1],
          arg.formatting.style.routineMethods
        ),
        kind: CompletionItemKind.Function,
        sortText: COMPLETION_SORT_PRIORITY.METHODS,
        detail: IDL_TRANSLATION.autoComplete.detail.procedureMethod,
      });
    }
    return;
  }

  /** Lower-case string to compare against our methods */
  const compareType = type.name.toLowerCase() + '::';

  // build cache for internal
  const keysInternal = Object.keys(PROCEDURE_METHODS);
  for (let i = 0; i < keysInternal.length; i++) {
    const methodName = keysInternal[i].split('::')[1];
    if (keysInternal[i].startsWith(compareType) && !(methodName in arg.found)) {
      arg.complete.push({
        label: PROCEDURE_METHODS[keysInternal[i]],
        insertText: TransformCase(
          PROCEDURE_METHODS[keysInternal[i]].split('::')[1],
          arg.formatting.style.routineMethods
        ),
        kind: CompletionItemKind.Function,
        sortText: COMPLETION_SORT_PRIORITY.METHODS,
        detail: IDL_TRANSLATION.autoComplete.detail.procedureMethod,
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
        BuildProcedureMethodCompletionItems({
          ...arg,
          ...{
            options: {
              type: ParseIDLType(inherits[i]),
            },
          },
        });
      }
    }
  }
}

/**
 * Creates options for creating property completion items
 */
export function GetProcedureMethodCompletionOptions(
  type: IDLDataType
): IProcedureMethodCompletionOptions {
  return {
    type,
  };
}

/**
 * Adds variables to our completion items
 */
export function BuildProcedureMethodCompletionItems(
  arg: IProcedureMethodCompletionArg
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
    BuildProcedureMethodCompletionItemsForType(arg, arg.options.type[i]);
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
