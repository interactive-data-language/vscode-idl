import { IParsed } from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../idl-index.class';
import { PopulateType } from './tree-handlers/populate-type';
import { ValidateType } from './tree-handlers/validate-type';

/**
 * Populate type based on assignment of variables
 */
export function PopulateAndValidateType(
  index: IDLIndex,
  file: string,
  parsed: IParsed
) {
  // populate types
  PopulateType(index, file, parsed);

  // validate types
  ValidateType(index, file, parsed);
}
