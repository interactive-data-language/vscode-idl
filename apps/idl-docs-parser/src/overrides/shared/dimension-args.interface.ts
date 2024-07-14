import { IDL_ANY_TYPE, IDL_NUMBER_TYPE } from '@idl/types/core';

import { ISharedArgsOrKeywords } from './shared.interface';

/**
 * Arguments for type conversion functions
 */
export const TYPE_FUNCTION_ARGS: ISharedArgsOrKeywords = {
  expression: {
    direction: 'in',
    code: true,
    type: IDL_ANY_TYPE,
    req: false,
  },
  offset: {
    direction: 'in',
    code: true,
    type: IDL_ANY_TYPE,
    req: false,
  },
};

/**
 * Arguments for dimension args
 */
export const DIMENSION_ARGS: ISharedArgsOrKeywords = {
  d1: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd1',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d2: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd2',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d3: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd3',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d4: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd4',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d5: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd5',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d6: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd6',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d7: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd7',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
  d8: {
    direction: 'in',
    req: false,
    code: true,
    display: 'd8',
    source: 'internal',
    type: IDL_NUMBER_TYPE,
  },
};
