import { CancellationToken } from '@idl/cancellation-tokens';
import { SimplifiedBuildSyntaxTree } from '@idl/parsing/shared';
import { Tokenizer, TYPE_FIND_TOKEN_OPTIONS } from '@idl/tokenizer';
import { SyntaxProblems } from '@idl/types/problem-codes';

/**
 * Parses a type string as a syntax tree using type grammmar definitions
 */
export function TypeParser(type: string) {
  /** Create cancellation token */
  const cancel = new CancellationToken();

  /** Extract type tokens */
  const tokenized = Tokenizer(type, cancel, TYPE_FIND_TOKEN_OPTIONS);

  /** Hold syntax problems */
  const problems: SyntaxProblems = [];

  /** Create syntax tree */
  const tree = SimplifiedBuildSyntaxTree(tokenized.tokens, problems, true);
}
