import './validators/validate-keywords';
import './validators/undefined-variable';
import './validators/validate-assignment';
import './validators/validate-arguments';
import './validators/ambiguous-keyword-usage';

import { CancellationToken } from '@idl/cancellation-tokens';
import { ILocalTokenLookup, IParsed } from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../../idl-index.class';
import { SetVariables } from './set-variables';
import { VALIDATE_TYPE_HANDLER } from './validate-type-handler';

/**
 * Applies styles from a tree handler to our parsed code
 */
export function ValidateType(
  index: IDLIndex,
  file: string,
  parsed: IParsed,
  cancel: CancellationToken
) {
  // init variables
  const variables: ILocalTokenLookup = {};

  /** Last name of our root token */
  let lastCheck = '';

  /** Base metadata */
  const baseMeta = { variables, index, file };

  // process our tree
  VALIDATE_TYPE_HANDLER.run(parsed, cancel, (token, meta) => {
    // make sure we have a token, undefined for full-tree
    if (token !== undefined) {
      const use = token.scopeTokens[0] || token;
      const id = `${use.pos[0]}-${use.pos[1]}-${use.pos[2]}`;

      // check for diff
      if (id !== lastCheck) {
        lastCheck = id;
        SetVariables(use, parsed, variables);
      }
    }

    return Object.assign(baseMeta, meta);
  });
}
