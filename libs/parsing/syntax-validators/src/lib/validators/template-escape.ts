import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
  (token, parsed) => {
    switch (true) {
      // just a single backspace character is the start of escape, but nothing
      // else because we didnt match known tokens
      case token.match[0] === '\\':
        token.parseProblems.push(
          IDL_PROBLEM_CODES.UNKNOWN_TEMPLATE_LITERAL_ESCAPE
        );
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.UNKNOWN_TEMPLATE_LITERAL_ESCAPE,
            token.pos,
            token.pos
          )
        );
        break;
      // invalid hex code
      case token.match[0].startsWith('\\X'):
        token.parseProblems.push(IDL_PROBLEM_CODES.TEMPLATE_LITERAL_HEX);
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.TEMPLATE_LITERAL_HEX,
            token.pos,
            token.pos
          )
        );
        break;
      default:
        break;
    }
  }
);
