import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/types/syntax-tree';

import { PopulateIndex } from './populate-index';
import { PopulateScope } from './populate-scope';
import { PopulateGlobalLocalCompileOpts } from './populators/populate-global';
import { IDL_SYNTAX_TREE_POST_PROCESSOR } from './post-processor.interface';
import { DEFAULT_CURRENT } from './recursion-and-callbacks/tree-recurser.interface';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  IDLSyntaxValidatorMeta,
} from './validator.interface';

/**
 * Builds our syntax tree and saves it in the tokenized version of our code
 */
export function PopulateSyntaxTree(
  parsed: IParsed,
  cancel: CancellationToken,
  full: boolean
) {
  // set tree index
  PopulateIndex(parsed.tree);

  // populate the scope
  PopulateScope(parsed, cancel);

  // perform post-processing
  IDL_SYNTAX_TREE_POST_PROCESSOR.processTree(
    parsed.tree,
    parsed,
    DEFAULT_CURRENT
  );

  /**
   * Populate our global, local (variables), and compile-opts
   *
   * Populate global tokens - do note that this also populates docs
   * so we probably dont want to turn it off
   *
   * If it is off, we dont get hover help or useful auto-complete
   */
  PopulateGlobalLocalCompileOpts(parsed, cancel, true || parsed.type === 'def');

  // validate tree
  if (full) {
    // set tree index again because we might have manipulated our syntax tree
    PopulateIndex(parsed.tree);

    // populate the scope again in case our tree changed
    PopulateScope(parsed, cancel);

    // create metadata for our syntax validator
    // leave this for type checks even though unused
    const validatorMeta: IDLSyntaxValidatorMeta = {
      ...DEFAULT_CURRENT,
    };

    // run our syntax validation
    IDL_SYNTAX_TREE_VALIDATOR.run(parsed, cancel, (token, meta) => {
      return meta;
    });
  }
}
