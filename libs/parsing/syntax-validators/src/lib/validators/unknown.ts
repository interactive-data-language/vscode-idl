import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import {
  IDL_PROBLEM_CODES,
  IDLProblemCode,
  ISyntaxProblem,
} from '@idl/types/problem-codes';

const KNOWN_UNKNOWNS: { [key: string]: IDLProblemCode } = {
  '->': IDL_PROBLEM_CODES.ILLEGAL_ARROW,
  ',': IDL_PROBLEM_CODES.ILLEGAL_COMMA,
  ':': IDL_PROBLEM_CODES.ILLEGAL_COLON,
  '?': IDL_PROBLEM_CODES.ILLEGAL_TERNARY,
  '{': IDL_PROBLEM_CODES.ILLEGAL_STRUCTURE,
  '(': IDL_PROBLEM_CODES.ILLEGAL_PARENTHESES,
  '[': IDL_PROBLEM_CODES.ILLEGAL_BRACKET,
};

/**
 * Handle unknown variables and check for specific tokens which have special
 * problem codes.
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(TOKEN_NAMES.UNKNOWN, (token, parsed) => {
  // initialize problem
  let problem: ISyntaxProblem;

  /** Get first character */
  const trimmed = token.match[0].trim();

  // determine if we have a problem
  switch (true) {
    case trimmed in KNOWN_UNKNOWNS:
      token.parseProblems.push(KNOWN_UNKNOWNS[trimmed]);
      problem = SyntaxProblemWithTranslation(
        KNOWN_UNKNOWNS[trimmed],
        token.pos,
        token.pos
      );
      break;
    case trimmed.startsWith('@'):
      token.parseProblems.push(IDL_PROBLEM_CODES.ILLEGAL_INCLUDE);
      problem = SyntaxProblemWithTranslation(
        IDL_PROBLEM_CODES.ILLEGAL_INCLUDE,
        token.pos,
        token.pos
      );
      break;
    default:
      token.parseProblems.push(IDL_PROBLEM_CODES.UNKNOWN_TOKEN);
      problem = SyntaxProblemWithTranslation(
        IDL_PROBLEM_CODES.UNKNOWN_TOKEN,
        token.pos,
        token.pos
      );
      break;
  }

  // save our problem
  parsed.parseProblems.push(problem);
});
