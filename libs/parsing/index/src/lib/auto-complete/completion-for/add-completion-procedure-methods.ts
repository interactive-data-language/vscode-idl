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
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for procedure methods
 */
const PROCEDURE_METHODS =
  IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD];

/**
 * Adds variables to our completion items
 */
function AddCompletionProcedureMethodsForType(
  complete: CompletionItem[],
  index: IDLIndex,
  formatting: IAssemblerOptions<FormatterType>,
  type: IDLDataTypeBase<IDLTypes>,
  found: { [key: string]: any } = {}
) {
  /**
   * If we have any type, return everything
   */
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    const displayNames = Object.values(PROCEDURE_METHODS);
    for (let i = 0; i < displayNames.length; i++) {
      complete.push({
        label: displayNames[i],
        insertText: TransformCase(
          displayNames[i].split('::')[1],
          formatting.style.routineMethods
        ),
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.METHODS,
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
    if (keysInternal[i].startsWith(compareType) && !(methodName in found)) {
      complete.push({
        label: PROCEDURE_METHODS[keysInternal[i]],
        insertText: TransformCase(
          PROCEDURE_METHODS[keysInternal[i]].split('::')[1],
          formatting.style.routineMethods
        ),
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.METHODS,
        detail: IDL_TRANSLATION.autoComplete.detail.procedureMethod,
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
        AddCompletionProcedureMethods(
          complete,
          index,
          formatting,
          ParseIDLType(inherits[i]),
          found
        );
      }
    }
  }
}

/**
 * Adds variables to our completion items
 */
export function AddCompletionProcedureMethods(
  complete: CompletionItem[],
  index: IDLIndex,
  formatting: IAssemblerOptions<FormatterType>,
  type: IDLDataType,
  found: { [key: string]: any } = {}
) {
  // process each type
  for (let i = 0; i < type.length; i++) {
    AddCompletionProcedureMethodsForType(
      complete,
      index,
      formatting,
      type[i],
      found
    );
  }
}
