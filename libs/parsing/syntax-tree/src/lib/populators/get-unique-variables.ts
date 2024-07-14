import {
  CommentToken,
  MainLevelToken,
  RoutineFunctionToken,
  RoutineMethodNameToken,
  RoutineNameToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import {
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GlobalRoutineToken,
  IDL_ANY_TYPE,
  IParameterOrPropertyDetails,
} from '@idl/types/core';

import { IBasicBranch, IBranch, TreeToken } from '../branches.interface';
import { IDL_DOCS_HEADERS } from '../docs/docs.interface';
import { ExtractDocs } from '../docs/extract-docs';
import { JoinDocs } from '../docs/join-docs';
import { FindAllBranchChildren } from '../helpers/searching/find-all-branch-children';
import { FindAllBranchChildrenAndDocs } from '../helpers/searching/find-all-branch-children-and-docs';
import { IParsed } from '../parsed.interface';
import {
  ILocalIndexedToken,
  ILocalTokenLookup,
  LOCAL_TOKEN_LOOKUP,
  LocalVariableToken,
} from './populate-local.interface';
import { ReplaceFunctionsAsVariables } from './replace-functions-as-variables';

/**
 * Gets variables from a branch (first instance of them)
 *
 * We also check the compile options for the routine and, if we don't have
 * idl2 or strictarr, then we check and see if there are functions that should
 * really be represented as variables.
 */
export function GetUniqueVariables(
  branch: IBranch<
    RoutineProcedureToken | RoutineFunctionToken | MainLevelToken
  >,
  parsed: IParsed,
  compileOpts: string[], // lower case compile options
  global?: GlobalRoutineToken
): ILocalTokenLookup {
  /** Init local variables */
  const local: ILocalTokenLookup = {};

  // extract information from global to help fill in the gaps for local
  // this will pull out argument/keyword docs that a user may have specified
  const gArgs: { [key: string]: IParameterOrPropertyDetails } = {};

  // check for global information - might be main level so there is nothing else to do
  if (global !== undefined) {
    // map keywords from external to internal names
    const valuesArgs = Object.values(global.meta.args);
    for (let i = 0; i < valuesArgs.length; i++) {
      // only save if real and not fake
      if (valuesArgs[i].code) {
        gArgs[valuesArgs[i].display.toLowerCase()] = valuesArgs[i];
      }
    }

    // get the routine name - safe assumption because we cant have a global
    // token without a routine name first
    const first = branch.kids[0] as TreeToken<
      RoutineNameToken | RoutineMethodNameToken
    >;

    // get actual keywords
    const kws = FindAllBranchChildren(first, TOKEN_NAMES.KEYWORD_DEFINITION);

    // process each keyword
    for (let i = 0; i < kws.length; i++) {
      // get variable
      const assign = first.kids[kws[i].idx + 1];

      // sanity check that it is indeed a var
      if (assign?.name !== TOKEN_NAMES.ASSIGNMENT) {
        continue;
      }

      // get variable
      const variable = assign.kids[0];

      // sanity check that it is indeed a var
      if (variable?.name !== TOKEN_NAMES.VARIABLE) {
        continue;
      }

      // get the name of our keyword
      const kwName = kws[i].match[0].toLowerCase();

      // get our keyword
      const kw = global.meta.kws[kwName];

      // get variable name
      const varName = variable.match[0].toLowerCase();

      // define what we add, do this so it is strictly typed
      const add: ILocalIndexedToken<LocalVariableToken> = {
        type: LOCAL_TOKEN_LOOKUP.VARIABLE,
        name: varName,
        pos: variable.pos,
        meta: {
          display: variable.match[0],
          isDefined: true,
          usage: [], // dont init, populated below
          docs: kw.docs,
          source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
          type: kw.type,
        },
      };

      // save token
      local[varName] = add;
    }
  }

  // save arguments
  const args = FindAllBranchChildren(branch, TOKEN_NAMES.ARG_DEFINITION);

  // process each argument
  for (let i = 0; i < args.length; i++) {
    // get the name
    const origName = args[i].match[0];
    const name = origName.toLowerCase();

    // save if it is the first instance of our variable being used
    if (!(name in local)) {
      // define what we add, do this so it is strictly typed
      const add: ILocalIndexedToken<LocalVariableToken> = {
        type: LOCAL_TOKEN_LOOKUP.VARIABLE,
        name: name,
        pos: args[i].pos,
        meta: {
          display: origName,
          isDefined: true,
          usage: [args[i].pos], // dont init, populated below
          docs: name in gArgs ? gArgs[name].docs : '',
          source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
          type: name in gArgs ? gArgs[name].type : IDL_ANY_TYPE,
        },
      };

      // save token
      local[name] = add;
    } else {
      local[name].meta.usage.push(args[i].pos);
    }
  }

  // get all child variables - keywords, return values from keywords, etc
  const vars = FindAllBranchChildrenAndDocs(branch, TOKEN_NAMES.VARIABLE);

  // process each child
  for (let i = 0; i < vars.length; i++) {
    // get the name
    const origName = vars[i].token.match[0];
    const name = origName.toLowerCase();

    // skip variables in a lambda function
    if (vars[i].token.scope.indexOf(TOKEN_NAMES.CALL_LAMBDA_FUNCTION) !== -1) {
      continue;
    }

    // check our parent
    const parent = vars[i].token.scope.slice(-1)[0];

    // if we have a common block, and its the first child with the name of the block, skip
    if (parent === TOKEN_NAMES.CONTROL_COMMON && vars[i].token.idx === 0) {
      continue;
    }

    // check if we have docs for our variable
    let docs = '';
    if (vars[i].docs !== undefined) {
      // generate our docs
      const comments = vars[i].docs.kids as IBasicBranch<CommentToken>[];
      const varDocs = ExtractDocs(comments);

      // combine docs together and report problems for left-alignment
      docs = JoinDocs(
        varDocs[IDL_DOCS_HEADERS.DEFAULT].docs,
        varDocs[IDL_DOCS_HEADERS.DEFAULT].comments,
        parsed.parseProblems
      );
    }

    // save if it is the first instance of our variable being used
    if (!(name in local)) {
      // check if we can potentially be a keyword with bad naming
      const inDef =
        vars[i].token.scope[1] === TOKEN_NAMES.ROUTINE_NAME ||
        vars[i].token.scope[1] === TOKEN_NAMES.ROUTINE_METHOD_NAME;

      // define what we add, do this so it is strictly typed
      const add: ILocalIndexedToken<LocalVariableToken> = {
        type: LOCAL_TOKEN_LOOKUP.VARIABLE,
        name: name,
        pos: vars[i].token.pos,
        meta: {
          display: origName,
          isDefined:
            (inDef && name !== 'self') || parent === TOKEN_NAMES.CONTROL_COMMON
              ? true
              : false,
          usage: [vars[i].token.pos],
          docs: docs,
          source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
          type: IDL_ANY_TYPE,
        },
      };

      // save token
      local[name] = add;
    } else {
      local[name].meta.usage.push(vars[i].token.pos);
    }
  }

  /**
   * Check if we have strict arr
   */
  const strictArr =
    compileOpts.indexOf('idl2') !== -1 ||
    compileOpts.indexOf('idl3') !== -1 ||
    compileOpts.indexOf('strictarr') !== -1;

  /**
   * Check if we might have parentheses being used for indexing a variable
   */
  if (!strictArr) {
    ReplaceFunctionsAsVariables(parsed, branch, local);
  }

  return local;
}
