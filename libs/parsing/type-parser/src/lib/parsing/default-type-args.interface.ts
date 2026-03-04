import {
  IDL_ANY_TYPE,
  IDL_TYPE_LOOKUP,
  IDLDataType,
} from '@idl/types/idl-data-types';
import { copy } from 'fast-copy';

/**
 * For each known IDL data type, specify which types are allowed to have type arguments
 * and what the defaults should be if none are present.
 *
 * !!!IMPORTANT NOTE!!!
 *
 * This only has logic for a single type-argument for right now.
 */
export const DEFAULT_TYPE_ARGS: { [key: string]: IDLDataType[] } = {};
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.ARRAY] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.ARRAY_PROMOTION] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.LIST] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.OBJECT] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.POINTER] = [copy(IDL_ANY_TYPE)];
// DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.STRUCTURE] = [copy(IDL_ANY_TYPE)]
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.TYPE_OF_ARG] = [
  [
    {
      name: IDL_TYPE_LOOKUP.NUMBER,
      display: IDL_TYPE_LOOKUP.NUMBER,
      serialized: `0`,
      meta: {},
      value: [`0`],
      args: [],
    },
  ],
];

// these really have two types: values and index/key
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.HASH] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.ORDERED_HASH] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.DICTIONARY] = [copy(IDL_ANY_TYPE)];

// tasks
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.ENVI_TASK] = [copy(IDL_ANY_TYPE)];
DEFAULT_TYPE_ARGS[IDL_TYPE_LOOKUP.IDL_TASK] = [copy(IDL_ANY_TYPE)];
