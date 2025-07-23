import {
  FindAllBranchChildren,
  IDL_SYNTAX_TREE_VALIDATOR,
  IParsed,
  ITreeRecurserCurrent,
  SyntaxProblemWithTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  LogicalCaseToken,
  LogicalIfToken,
  LogicalSwitchToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';
import { PositionToRange } from '@idl/tokenizer/common';
import { IDL_PROBLEM_CODES, IDLProblemCode } from '@idl/types/problem-codes';

/**
 * Operator problem code lookup
 */
const PROBLEM_LOOKUP: { [key: string]: IDLProblemCode } = {};
PROBLEM_LOOKUP['and'] = IDL_PROBLEM_CODES.LOGICAL_AND;
PROBLEM_LOOKUP['or'] = IDL_PROBLEM_CODES.LOGICAL_OR;
PROBLEM_LOOKUP['not'] = IDL_PROBLEM_CODES.LOGICAL_NOT;
PROBLEM_LOOKUP['xor'] = IDL_PROBLEM_CODES.LOGICAL_XOR;

/**
 * Callback to handle operators
 */
function ValidateOperators(
  token: TreeToken<LogicalCaseToken | LogicalIfToken | LogicalSwitchToken>,
  parsed: IParsed,
  current: ITreeRecurserCurrent
) {
  // return if no kids
  if (token.kids.length === 0) {
    return;
  }

  // return if no global parent
  if (!current.globalParent) {
    return;
  }

  /** Get our global parent token */
  const global = current.globalParent;

  /** Get compile opts for our file */
  const compile = parsed.compile;

  /** Track compile options */
  let compOpts: string[] = [];

  // extract compile options
  switch (true) {
    case global?.type === 'function':
      if (global.name in compile.func) {
        compOpts = compile.func[global.name];
      }
      break;
    case global?.type === 'procedure':
      if (global.name in compile.pro) {
        compOpts = compile.pro[global.name];
      }
      break;
    case global?.type === 'main':
      compOpts = compile.main;
      break;
    default:
      break;
  }

  // check for our compile option
  const shouldCheck =
    compOpts.indexOf('idl3') !== -1 ||
    compOpts.indexOf('logical_predicate') !== -1;

  // check what to do
  if (!shouldCheck) {
    return;
  }

  /** Track tokens we dont recurse into */
  const dontRecurse = {};
  dontRecurse[TOKEN_NAMES.LOGICAL_THEN] = undefined;
  dontRecurse[TOKEN_NAMES.LOGICAL_ELSE] = undefined;
  dontRecurse[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = undefined;
  dontRecurse[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = undefined;

  /** Find all kids */
  const kids = FindAllBranchChildren(
    token,
    TOKEN_NAMES.OPERATOR_LOGICAL,
    dontRecurse
  );

  // process all kids
  for (let i = 0; i < kids.length; i++) {
    /** Get operator */
    const match = kids[i].match[0].trim().toLowerCase();

    // check if we have a problem
    if (match in PROBLEM_LOOKUP) {
      const prob = SyntaxProblemWithTranslation(
        PROBLEM_LOOKUP[match],
        kids[i].pos,
        kids[i].pos
      );

      // save problem information
      kids[i].parseProblems.push(PROBLEM_LOOKUP[match]);
      parsed.parseProblems.push(prob);

      // get replacement text to fix the problem
      let newText: string;
      switch (match) {
        case 'and':
          newText = kids[i].match[0].replace(/and/im, '&&');
          break;
        case 'not':
          newText = kids[i].match[0].replace(/not/im, '~');
          break;
        case 'or':
          newText = kids[i].match[0].replace(/or/im, '||');
          break;
        default:
          break;
      }

      // check if we have an edit to save
      if (newText) {
        prob.edits = [
          {
            range: PositionToRange(kids[i].pos),
            newText,
          },
        ];
      }
    }
  }
}

/**
 * Branch tokens to track
 */
const BRANCHES = [
  TOKEN_NAMES.LOGICAL_IF,
  TOKEN_NAMES.LOGICAL_CASE,
  TOKEN_NAMES.LOGICAL_SWITCH,
];

for (let i = 0; i < BRANCHES.length; i++) {
  IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
    BRANCHES[i],
    (token, parsed, current) => {
      ValidateOperators(token, parsed, current);
    }
  );
}
