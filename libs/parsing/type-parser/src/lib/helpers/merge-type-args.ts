import { IDLDataType } from '@idl/types/idl-data-types';

/**
 * Merges two sets of type arguments
 *
 * Rules:
 *
 * 1. Merges based on argument position into reference args
 * 2. Stops when we exceed number of elements to merge
 */
export function MergeTypeArgs(argRef: IDLDataType[], argMerge: IDLDataType[]) {
  // iterate over all common elements
  for (let i = 0; i < Math.min(argRef.length, argMerge.length); i++) {
    argRef[i] = argRef[i].concat(...argMerge[i]);
  }
}
