import './populators/type-from-include';
import './populators/type-from-foreach';
// import './populators/variables-from-keywords';
import './populators/type-from-assignment';
import './populators/type-from-arguments';

import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../../idl-index.class';

/**
 * Populates data types in our syntax tree
 */
export function PopulateType(
  index: IDLIndex,
  file: string,
  parsed: IParsed,
  cancel: CancellationToken
) {}
