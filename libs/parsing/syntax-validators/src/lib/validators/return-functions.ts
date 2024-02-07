import {
  FindAllBranchChildren,
  FindDirectBranchChildren,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Routine name tokens
 */
export const NAME_TOKENS: { [key: string]: any } = {};
NAME_TOKENS[TOKEN_NAMES.ROUTINE_NAME] = true;
NAME_TOKENS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Check return statements in functions
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_FUNCTION,
  (token, parsed) => {
    // get all procedures we are calling
    const returns = FindAllBranchChildren(token, TOKEN_NAMES.CALL_PROCEDURE);

    // error if no return procedure
    if (returns.length === 0) {
      // get end position at end of routine name
      let endPos = token.pos;
      const first = token.kids[0];
      if (first?.name in NAME_TOKENS) {
        if ((first as TreeBranchToken).end !== undefined) {
          endPos = (first as TreeBranchToken).end.pos;
        }
      }

      token.parseProblems.push(IDL_PROBLEM_CODES.RETURN_MISSING);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.RETURN_MISSING,
          token.pos,
          endPos
        )
      );
    }

    // process all of our procedures
    for (let i = 0; i < returns.length; i++) {
      if (returns[i].match[0].toLowerCase() === 'return') {
        // get number of commas
        const commas = FindDirectBranchChildren(returns[i], TOKEN_NAMES.COMMA);
        switch (commas.length) {
          // good
          case 1:
            // do nothing
            break;
          // missing
          case 0:
            returns[i].parseProblems.push(
              IDL_PROBLEM_CODES.RETURN_FUNCTION_MISSING
            );
            parsed.parseProblems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.RETURN_FUNCTION_MISSING,
                returns[i].pos,
                returns[i].end ? returns[i].end.pos : returns[i].pos
              )
            );
            break;
          default:
            // too many
            returns[i].parseProblems.push(
              IDL_PROBLEM_CODES.RETURN_VALUES_FUNCTIONS
            );
            parsed.parseProblems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.RETURN_VALUES_FUNCTIONS,
                returns[i].pos,
                returns[i].end ? returns[i].end.pos : returns[i].pos
              )
            );
            break;
        }
      }
    }
  }
);
