import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_PROBLEM_CODES, IDLProblemCode } from '@idl/parsing/problem-codes';
import {
  IBasicToken,
  MainLevelToken,
  TOKEN_NAMES,
  TOKEN_TYPES,
  TokenizerToken,
  TokenName,
  UnknownToken,
} from '@idl/parsing/tokenizer';

import {
  BRANCH_TYPES,
  IBasicBranch,
  IBranch,
  SyntaxTree,
  TreeToken,
} from './branches.interface';
import {
  DEFAULT_PARSED,
  IParsed,
  IRecurserCloseOptions,
  IRecurserOptions,
} from './build-syntax-tree.interface';
import { PopulateIndex } from './populate-index';
import { PopulateScope } from './populate-scope';
import { GetUniqueVariables } from './populators/get-unique-variables';
import { IDL_SYNTAX_TREE_POST_PROCESSOR } from './post-processor.interface';
import { DEFAULT_CURRENT } from './recursion-and-callbacks/tree-recurser.interface';
import { SyntaxProblemWithTranslation } from './syntax-problem-with';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  IDLSyntaxValidatorMeta,
} from './validator.interface';

/**
 * Actually extract our tokens and make the syntax tree
 *
 * IMPORTANT NOTE: "i" is the i-th element of our flat syntax tree. We
 * set it as the "idx" value below to have a placeholder, but it gets
 * truly populated after this runs.
 */
function BuildTreeRecurser(
  tokens: TokenizerToken<TokenName>[],
  options: IRecurserOptions,
  closer?: IRecurserCloseOptions
): SyntaxTree {
  /** Tree of tokens */
  const tree: SyntaxTree = [];

  // process each token
  for (let i = options.start + 1; i < tokens.length; i++) {
    // console.log(`Loop: ${i}, level: ${options.recursionLevel}`);
    // update our start position
    options.start++;

    // extract our token
    const token = tokens[i];

    /** Problems associated with the current token that we save */
    const parseProblems: IDLProblemCode[] = [];

    // if we have encountered a main level program, every other token is then a problem
    // its OK if this shows a ridiculous number of problems because it should be
    // readily apparent that there is an issue
    if (options.foundMain && options.full) {
      // if we have anything besides a comment, report problem and leave out of syntax tree
      if (token.name !== TOKEN_NAMES.COMMENT) {
        options.syntax.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.AFTER_MAIN,
            token.pos,
            token.pos
          )
        );
        parseProblems.push(IDL_PROBLEM_CODES.AFTER_MAIN);
      }
    }

    // check if we need to do anything special about our token
    switch (token.name) {
      case TOKEN_NAMES.UNEXPECTED_CLOSER:
        // track problem, dont do anything with our token
        options.syntax.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.UNEXPECTED_CLOSER,
            token.pos,
            token.pos
          )
        );
        parseProblems.push(IDL_PROBLEM_CODES.UNEXPECTED_CLOSER);
        continue;
      case TOKEN_NAMES.MAIN_LEVEL_END:
        options.foundMain = true;
        break;
      default:
        // do nothing
        break;
    }

    // handle the type of our token
    switch (token.type) {
      case TOKEN_TYPES.BASIC:
        {
          const basic: IBasicBranch<any> = {
            type: BRANCH_TYPES.BASIC,
            name: token.name,
            pos: token.pos,
            match: token.matches,
            idx: i,
            scope: [],
            parseProblems,
          };
          tree.push(basic);

          // perform post-processing
          IDL_SYNTAX_TREE_POST_PROCESSOR.processBasicToken(
            basic,
            DEFAULT_PARSED,
            () => DEFAULT_CURRENT
          );
        }
        break;
      case TOKEN_TYPES.START:
        {
          // make our close options
          const newCloser: IRecurserCloseOptions = {
            closeId: token._id,
          };

          // increment our recursion level
          options.recursionLevel++;

          // make our token
          const branch: IBranch<any> = {
            type: BRANCH_TYPES.BRANCH,
            name: token.name,
            pos: token.pos,
            match: token.matches,
            idx: i,
            scope: [],
            parseProblems,
            end: undefined,
            kids: BuildTreeRecurser(tokens, options, newCloser),
          };

          // adjust recursion level
          options.recursionLevel--;

          // check if we found a closing statement
          if (newCloser.closeIdx !== undefined) {
            // save end information
            branch.end = {
              pos: tokens[newCloser.closeIdx].pos,
              match: tokens[newCloser.closeIdx].matches,
            };
          } else {
            // only report first instance
            if (!options.notClosed) {
              options.syntax.push(
                SyntaxProblemWithTranslation(
                  IDL_PROBLEM_CODES.NOT_CLOSED,
                  branch.pos,
                  branch.pos
                )
              );
              parseProblems.push(IDL_PROBLEM_CODES.NOT_CLOSED);

              // update flag for fewer distracting errors
              options.notClosed = true;
            }
          }

          // save our token
          tree.push(branch);

          // update index
          i = options.start;

          // perform post-processing
          IDL_SYNTAX_TREE_POST_PROCESSOR.processBranchToken(
            branch,
            DEFAULT_PARSED,
            () => DEFAULT_CURRENT
          );
        }
        break;
      case TOKEN_TYPES.END:
        {
          // check if we are ending our token
          if (closer !== undefined) {
            // do we have a matching close ID?
            if (closer.closeId === token._id) {
              // set closer index and stop doing anything here
              // dont save this token because we will grab it up above
              closer.closeIdx = i;
              return tree;
            } else {
              // track problem, dont add to syntax tree
              options.syntax.push(
                SyntaxProblemWithTranslation(
                  IDL_PROBLEM_CODES.UNEXPECTED_CLOSER,
                  token.pos,
                  token.pos
                )
              );
              parseProblems.push(IDL_PROBLEM_CODES.UNEXPECTED_CLOSER);
            }
          } else {
            // track problem, dont add to syntax tree
            options.syntax.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.UNEXPECTED_CLOSER,
                token.pos,
                token.pos
              )
            );
            parseProblems.push(IDL_PROBLEM_CODES.UNEXPECTED_CLOSER);
          }
        }
        break;
      default:
        {
          // use "as any" because typescript is too smart that it is stupid to handle
          // this case which is a :never" because all other tokens are accounted for
          // which is silly because it means you can have an error for writing very thorough code
          console.log(
            `Warning: when building tree, found unexpected token type of "${
              (token as IBasicToken<TokenName>).type
            }"`
          );

          // dont save problem - these are caught un the unknown syntax validator
          // so not using this prevents double errors
          // options.syntax.push(
          //   ProblemWithTranslation(
          //     IDL_PROBLEM_CODES.UNKNOWN_BRANCH_TOKEN,
          //     pos,
          //     pos
          //   )
          // );
          // problems.push(IDL_PROBLEM_CODES.UNKNOWN_BRANCH_TOKEN);

          // default to basic token
          const basic: TreeToken<UnknownToken> = {
            type: BRANCH_TYPES.UNKNOWN,
            name: (token as IBasicToken<UnknownToken>).name,
            pos: (token as IBasicToken<UnknownToken>).pos,
            match: (token as IBasicToken<UnknownToken>).matches,
            idx: i,
            scope: [],
            parseProblems,
          };
          tree.push(basic);
        }
        break;
    }
  }

  return tree;
}

/**
 * Builds our syntax tree and saves it in the tokenized version of our code
 */
export function BuildSyntaxTree(
  parsed: IParsed,
  cancel: CancellationToken,
  full: boolean,
  isNotebook: boolean
) {
  // build our syntax tree
  parsed.tree = BuildTreeRecurser(parsed.tokens, {
    start: -1,
    recursionLevel: 0,
    foundMain: false,
    syntax: parsed.parseProblems,
    notClosed: false,
    full,
  });

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

  // validate tree
  if (full) {
    // set tree index again because we might have manipulated our syntax tree
    PopulateIndex(parsed.tree);

    // populate the scope again in case our tree changed
    PopulateScope(parsed, cancel);

    // create metadata for our syntax validator
    // leave this for type checks even though unused
    const validatorMeta: IDLSyntaxValidatorMeta = {
      isNotebook,
      ...DEFAULT_CURRENT,
    };

    // run our syntax validation
    IDL_SYNTAX_TREE_VALIDATOR.run(parsed, cancel, (token, meta) => {
      Object.assign(meta, { isNotebook });
      return meta as any as IDLSyntaxValidatorMeta;
    });
  }
}

/**
 * Populates a lookup with quick information for where local things are defined
 */
export function PopulateLocal(parsed: IParsed) {
  // get local tokens
  const local = parsed.local;

  // extract our tree
  const tree = parsed.tree;

  // process all of the direct children in our tree
  for (let i = 0; i < tree.length; i++) {
    // extract our branch
    const branch = tree[i];

    // determine how to proceed
    switch (branch.name) {
      // handle main level programs - the others are handled elsewhere
      // inside of "populate-global.ts" or you can search for the name of the
      // function "GetUniqueVariables("
      case TOKEN_NAMES.MAIN_LEVEL:
        local.main = GetUniqueVariables(
          branch as IBranch<MainLevelToken>,
          parsed,
          parsed.compile.main
        );
        break;
      default:
        // do nothing
        break;
    }
  }
}
