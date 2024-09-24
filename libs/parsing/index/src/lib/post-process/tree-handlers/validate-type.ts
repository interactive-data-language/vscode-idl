import './validators/validate-keywords';
import './validators/undefined-variable';
import './validators/validate-assignment';
import './validators/validate-arguments';
import './validators/ambiguous-keyword-usage';

import { CancellationToken } from '@idl/cancellation-tokens';
import { ILocalTokenLookup, IParsed } from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../../idl-index.class';

/**
 * Validates data types in our syntax tree
 */
export function ValidateType(
  index: IDLIndex,
  file: string,
  parsed: IParsed,
  cancel: CancellationToken
) {
  // init variables
  const variables: ILocalTokenLookup = {};
}
