import { TransformCase } from '@idl/assembling/shared';
import { GetSortIndexForStrings } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { IPropertyCompletionOptions } from '@idl/types/auto-complete';
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
import { IPropertyCompletionArg } from './completion-properties.interface';

/**
 * Adds variables to our completion items
 */
function BuildPropertyCompletionItemsForType(
  arg: IPropertyCompletionArg,
  type: IDLDataTypeBase<IDLTypes>
) {
  // return if we dont have a type
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    return;
  }

  // check if we have an anonymous structure
  if (type.name === IDL_TYPE_LOOKUP.STRUCTURE) {
    const properties = type.meta;
    const keys = Object.keys(properties);
    for (let i = 0; i < keys.length; i++) {
      const lowKey = keys[i].toLowerCase();
      if (!(lowKey in arg.found)) {
        const display = TransformCase(
          properties[keys[i]].display,
          arg.formatting.style.properties
        );

        // add to completion
        arg.complete.push({
          label: display,
          insertText: display + arg.options.add,
          kind: CompletionItemKind.Field,
          sortText: COMPLETION_SORT_PRIORITY.PROPERTIES,
          documentation: properties[keys[i]].docs,
        });

        // save that we already processed this property
        arg.found[lowKey] = true;
      }
    }
    return;
  }

  // check for global token first
  const global = arg.index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    type.name.toLocaleLowerCase()
  );

  // check if we found a match
  if (global.length > 0) {
    const properties = global[0].meta.props;
    const keys = Object.keys(properties);
    for (let i = 0; i < keys.length; i++) {
      const lowKey = keys[i].toLowerCase();
      if (!(lowKey in arg.found)) {
        const display = TransformCase(
          properties[keys[i]].display,
          arg.formatting.style.properties
        );

        // add to completion
        arg.complete.push({
          label: display,
          insertText: display + arg.options.add,
          kind: CompletionItemKind.Field,
          sortText: COMPLETION_SORT_PRIORITY.PROPERTIES,
          detail: `${IDL_TRANSLATION.autoComplete.detail.property} ${global[0].meta.display}`,
          documentation: properties[keys[i]].docs,
        });

        // save that we already processed this property
        arg.found[lowKey] = true;
      }
    }

    // check if we have inheritance to consider
    const inherits = global[0].meta.inherits;
    if (inherits.length > 0) {
      for (let i = 0; i < inherits.length; i++) {
        BuildPropertyCompletionItems({
          ...arg,
          ...{
            options: {
              add: arg.options.add,
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
export function GetPropertyCompletionOptions(
  add: string,
  type: IDLDataType
): IPropertyCompletionOptions {
  return {
    add,
    type,
  };
}

/**
 * Adds variables to our completion items
 */
export function BuildPropertyCompletionItems(arg: IPropertyCompletionArg) {
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
    BuildPropertyCompletionItemsForType(arg, arg.options.type[i]);
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
