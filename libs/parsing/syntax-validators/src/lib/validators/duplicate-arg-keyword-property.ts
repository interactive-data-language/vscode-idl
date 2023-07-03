import { IDL_PROBLEM_CODES, IDLProblemCode } from '@idl/parsing/problem-codes';
import {
  BranchCallback,
  FindAllBranchChildren,
  FindDirectBranchChildren,
  IDL_SYNTAX_TREE_VALIDATOR,
  IDLSyntaxValidatorMeta,
  IParsed,
  SyntaxProblemWithTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  RoutineMethodNameToken,
  RoutineNameToken,
  StructureToken,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';

/**
 * Helper function to check and report duplicate problems for
 * an array of tokens based on the first match
 */
function CheckForDuplicatesByName(
  parsed: IParsed,
  tokens: TreeToken<TokenName>[],
  code: IDLProblemCode
) {
  // name of current token
  let tokenName: string;

  /** Lookup by name */
  const nameLookup: { [key: string]: TreeToken<TokenName>[] } = {};

  // track the number of args by name
  for (let i = 0; i < tokens.length; i++) {
    tokenName = tokens[i].match[0].toLowerCase().replace(/\s|\/|:|=/gim, '');
    if (!(tokenName in nameLookup)) {
      nameLookup[tokenName] = [];
    }
    nameLookup[tokenName].push(tokens[i]);
  }

  // check if we have duplicate
  // do this here so we dont accidentally report the
  // same error multiple times above
  const byName = Object.values(nameLookup);
  for (let i = 0; i < byName.length; i++) {
    // make sure we have more than one
    if (byName[i].length > 1) {
      // extract tokens
      const bad = byName[i];

      // add problems for all duplicate named entries
      for (let j = 0; j < bad.length; j++) {
        bad[j].parseProblems.push(code);
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(code, bad[j].pos, bad[j].pos)
        );
      }
    }
  }
}

/**
 * Checks for duplicate argument or keyword definitions
 */
const CALLBACK_DEFS: BranchCallback<
  RoutineMethodNameToken | RoutineNameToken,
  IDLSyntaxValidatorMeta
> = (branch, parsed) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }

  // get and check args
  CheckForDuplicatesByName(
    parsed,
    (
      FindAllBranchChildren(
        branch,
        TOKEN_NAMES.ARG_DEFINITION
      ) as TreeToken<TokenName>[]
    ).concat(FindAllBranchChildren(branch, TOKEN_NAMES.VARIABLE)),
    IDL_PROBLEM_CODES.DUPLICATE_ARG_VARIABLE_DEF
  );

  // get and check keywords
  CheckForDuplicatesByName(
    parsed,
    FindAllBranchChildren(branch, TOKEN_NAMES.KEYWORD_DEFINITION),
    IDL_PROBLEM_CODES.DUPLICATE_KEYWORD_DEF
  );
};

// add check
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_NAME,
  CALLBACK_DEFS
);
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_METHOD_NAME,
  CALLBACK_DEFS
);

/**
 * Checks for duplicate keyword usage
 */
const CALLBACK_KW_USAGE: BranchCallback<
  | CallFunctionToken
  | CallFunctionMethodToken
  | CallProcedureToken
  | CallProcedureMethodToken,
  IDLSyntaxValidatorMeta
> = (branch, parsed) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }
  CheckForDuplicatesByName(
    parsed,
    (
      FindDirectBranchChildren(
        branch,
        TOKEN_NAMES.KEYWORD
      ) as TreeToken<TokenName>[]
    ).concat(FindDirectBranchChildren(branch, TOKEN_NAMES.KEYWORD_BINARY)),
    IDL_PROBLEM_CODES.DUPLICATE_KEYWORD_USAGE
  );
};

// add check
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION,
  CALLBACK_KW_USAGE
);
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  CALLBACK_KW_USAGE
);
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CALL_PROCEDURE,
  CALLBACK_KW_USAGE
);
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
  CALLBACK_KW_USAGE
);

/**
 * Checks for duplicate structure properties
 */
const CALLBACK_PROPERTIES: BranchCallback<
  StructureToken,
  IDLSyntaxValidatorMeta
> = (branch, parsed) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }
  CheckForDuplicatesByName(
    parsed,
    FindDirectBranchChildren(branch, TOKEN_NAMES.STRUCTURE_PROPERTY),
    IDL_PROBLEM_CODES.DUPLICATE_PROPERTY
  );
};

// add check
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.STRUCTURE,
  CALLBACK_PROPERTIES
);
