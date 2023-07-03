import { IDLProblemCode } from '@idl/parsing/problem-codes';
import { TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

/**
 * Checks if a token has a given IDL problem code
 */
export function HasProblem(
  token: TreeToken<TokenName>,
  code: IDLProblemCode
): boolean {
  return token.parseProblems.indexOf(code) !== -1;
}
