import { CancellationToken } from '@idl/cancellation-tokens';
import { GetSemanticTokens } from '@idl/parsing/semantic-tokens';
import {
  IParsed,
  PopulateScopeDetailAndResetTokenCache,
} from '@idl/parsing/syntax-tree';

import { GetSyntaxProblems } from '../helpers/get-syntax-problems';
import { IDLIndex } from '../idl-index.class';
import { PostProcessIterator } from './post-process-iterator';

/**
 * Apply post-processing to a parsed file
 */
export function PostProcessParsed(
  index: IDLIndex,
  file: string,
  parsed: IParsed,
  cancel: CancellationToken
): boolean {
  // clear secondary problems
  parsed.postProcessProblems = [];

  /**
   * Reset cache and set scope detail if we need it
   */
  PopulateScopeDetailAndResetTokenCache(parsed, cancel);

  /**
   * Populate types of local variables and validate them
   */
  const updatedGlobals = PostProcessIterator(index, file, parsed, cancel);

  // update semantic tokens
  GetSemanticTokens(parsed);

  // update problems for our file
  index.trackSyntaxProblemsForFile(file, GetSyntaxProblems(parsed));

  // update cache
  index.parsedCache.updateProblems(file, parsed);
  index.parsedCache.updateSemantic(file, parsed);

  return updatedGlobals;
}
