import { IDL_BOOLEAN_TYPE, IDL_NUMBER_TYPE } from '@idl/types/core';

import { ISharedArgsOrKeywords } from './shared.interface';

/**
 * Keywords for the thread pool
 */
export const THREAD_POOL_KEYWORDS: ISharedArgsOrKeywords = {
  tpool_max_elts: {
    direction: 'in',
    type: IDL_NUMBER_TYPE,
    display: 'tpool_max_elts',
    private: false,
    code: true,
    source: 'internal',
    docs: 'Set this keyword to a non-zero value to set the maximum number of data elements involved in a computation that uses the thread pool. If the number of elements in the computation exceeds the number you specify, IDL will not use the thread pool for the computation. Setting this value to 0 removes any limit on the maximum number of elements, and any computation with at least TPOOL_MIN_ELTS will use the thread pool.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_MAX_ELTS.',
  },
  tpool_min_elts: {
    direction: 'in',
    type: IDL_NUMBER_TYPE,
    display: 'tpool_min_elts',
    private: false,
    code: true,
    source: 'internal',
    docs: 'Set this keyword to a non-zero value to set the minimum number of data elements involved in a computation that uses the thread pool. If the number of elements in the computation is less than the number you specify, IDL will not use the thread pool for the computation. Use this keyword to prevent IDL from using the thread pool on tasks that are too small to benefit from it.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_MIN_ELTS.',
  },
  tpool_nothread: {
    direction: 'in',
    type: IDL_BOOLEAN_TYPE,
    display: 'tpool_nothread',
    private: false,
    code: true,
    source: 'internal',
    docs: 'Set this keyword to explicitly prevent IDL from using the thread pool for the current computation. If this keyword is set, IDL will use the non-threaded implementation of the routine even if the current settings of the !CPU system variable would allow use of the threaded implementation.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_NTHREADS.',
  },
};

/**
 * Keywords for index generation
 */
export const INDGEN_KEYWORDS: ISharedArgsOrKeywords = {
  increment: {
    direction: 'in',
    type: IDL_NUMBER_TYPE,
  },
  start: {
    direction: 'in',
    type: IDL_NUMBER_TYPE,
  },
  ...THREAD_POOL_KEYWORDS,
};

/**
 * Keywords for ARRAY CREATION
 */
export const BASIC_ARRAY_CREATION: ISharedArgsOrKeywords = {
  nozero: {
    direction: 'in',
    type: IDL_BOOLEAN_TYPE,
  },
};
