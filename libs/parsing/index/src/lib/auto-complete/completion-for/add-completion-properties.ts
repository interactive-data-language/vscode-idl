import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
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
 * Adds variables to our completion items
 */
function AddCompletionPropertiesForType(
  complete: CompletionItem[],
  index: IDLIndex,
  type: IDLDataTypeBase<IDLTypes>,
  add = '',
  formatting: IAssemblerOptions<FormatterType>,
  found: { [key: string]: any } = {}
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
      if (!(lowKey in found)) {
        const display = TransformCase(
          properties[keys[i]].display,
          formatting.style.properties
        );

        // add to completion
        complete.push({
          label: display,
          insertText: display + add,
          kind: CompletionItemKind.Field,
          sortText: SORT_PRIORITY.PROPERTIES,
          documentation: properties[keys[i]].docs,
        });

        // save that we already processed this property
        found[lowKey] = true;
      }
    }
    return;
  }

  // check for global token first
  const global = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    type.name.toLocaleLowerCase()
  );

  // check if we found a match
  if (global.length > 0) {
    const properties = global[0].meta.props;
    const keys = Object.keys(properties);
    for (let i = 0; i < keys.length; i++) {
      const lowKey = keys[i].toLowerCase();
      if (!(lowKey in found)) {
        const display = TransformCase(
          properties[keys[i]].display,
          formatting.style.properties
        );

        // add to completion
        complete.push({
          label: display,
          insertText: display + add,
          kind: CompletionItemKind.Field,
          sortText: SORT_PRIORITY.PROPERTIES,
          detail: `${IDL_TRANSLATION.autoComplete.detail.property} ${global[0].meta.display}`,
          documentation: properties[keys[i]].docs,
        });

        // save that we already processed this property
        found[lowKey] = true;
      }
    }

    // check if we have inheritance to consider
    const inherits = global[0].meta.inherits;
    if (inherits.length > 0) {
      for (let i = 0; i < inherits.length; i++) {
        AddCompletionProperties(
          complete,
          index,
          ParseIDLType(inherits[i]),
          add,
          formatting,
          found
        );
      }
    }
  }
}

/**
 * Adds variables to our completion items
 */
export function AddCompletionProperties(
  complete: CompletionItem[],
  index: IDLIndex,
  type: IDLDataType,
  add = '',
  formatting: IAssemblerOptions<FormatterType>,
  found: { [key: string]: any } = {}
) {
  // process each type
  for (let i = 0; i < type.length; i++) {
    AddCompletionPropertiesForType(
      complete,
      index,
      type[i],
      add,
      formatting,
      found
    );
  }
}
