import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  IDL_ANY_TYPE,
  IDL_BOOLEAN_TYPE,
  IDL_NUMBER_TYPE,
} from '@idl/types/idl-data-types';

import { IProcedureMethodOverride } from '../detail.interface';

/**
 * Overrides for procedure method metadata when generating internal docs
 */
export const PROCEDURE_METHOD_OVERRIDE: IProcedureMethodOverride = {
  'dictionary::remove': {
    args: {
      keys: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType(
          'Number | String | Array<Number | String >',
        ),
      },
    },
    kws: {
      all: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'hash::remove': {
    args: {
      keys: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType(
          'Number | String | Array<Number | String >',
        ),
      },
    },
    kws: {
      all: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'list::add': {
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      index: {
        req: false,
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
    },
    kws: {
      extract: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'list::move': {
    args: {
      source: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      destination: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
    },
    kws: {},
  },
  'list::remove': {
    args: {
      indices: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('Number | Array<Number>'),
      },
    },
    kws: {
      all: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'list::swap': {
    args: {
      index1: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      index2: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
    },
    kws: {},
  },
  'orderedhash::remove': {
    args: {
      keys: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType(
          'Number | String | Array<Number | String >',
        ),
      },
    },
    kws: {
      all: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
};
