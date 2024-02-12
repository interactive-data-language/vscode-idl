import { IsProblemDisabled } from '@idl/parser';
import { TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';
import { IDisabledProblems, IDLProblemCode } from '@idl/types/problem-codes';

/**
 * Checks if a token has a given IDL problem code
 */
export function HasProblem(
  token: TreeToken<TokenName>,
  code: IDLProblemCode,
  disabled: IDisabledProblems
): boolean {
  // make sure we have the problem code AND that it is not disabled for that line
  return (
    !IsProblemDisabled(code, token.pos[0], disabled) &&
    token.parseProblems.indexOf(code) !== -1
  );
}
