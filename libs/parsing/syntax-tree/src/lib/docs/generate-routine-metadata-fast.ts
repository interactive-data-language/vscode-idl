import {
  DEFAULT_DATA_TYPE,
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  ParseIDLType,
} from '@idl/types/core';

import {
  FunctionRoutineType,
  ProcedureRoutineType,
  RoutineMetadata,
  RoutineType,
} from './generate-routine-metadata.interface';

/**
 * Takes comments from a comment block and converts it into
 * documentation for things like hover help and auto-complete.
 */
export function GenerateRoutineMetadataFast<T extends RoutineType>(
  type: T
): RoutineMetadata<T> {
  // initialize metadata
  let meta: RoutineMetadata<T>;

  // populate based on values - typescript has a bug or something
  // auto-complete works, but it complains when you try to set directly
  // so we strictly type things here and work around the problem
  if (type === 'procedure') {
    const nonsense: RoutineMetadata<ProcedureRoutineType> = {
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      args: {},
      docs: '',
      docsLookup: {},
      display: '',
      kws: {},
      private: false,
      struct: [],
    };

    // typescript is stupid
    meta = nonsense as RoutineMetadata<T>;
  } else {
    const nonsense: RoutineMetadata<FunctionRoutineType> = {
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      args: {},
      docs: '',
      docsLookup: {},
      display: '',
      kws: {},
      private: false,
      returns: ParseIDLType(DEFAULT_DATA_TYPE),
      struct: [],
    };

    // typescript is stupid
    meta = nonsense as RoutineMetadata<T>;
  }

  return meta;
}
