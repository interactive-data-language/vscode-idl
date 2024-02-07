import {
  CommentBlockToken,
  CommentToken,
  RoutineFunctionToken,
  RoutineMethodNameToken,
  RoutineNameToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  DEFAULT_DATA_TYPE,
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GlobalStructureToken,
  IGlobalIndexedToken,
  IParameterLookup,
  ParseIDLType,
} from '@idl/types/core';
import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/types/problem-codes';

import { IBasicBranch, IBranch } from '../branches.interface';
import { FindDirectBranchChildren } from '../helpers/searching/find-direct-branch-children';
import {
  SyntaxProblemWithoutTranslation,
  SyntaxProblemWithTranslation,
} from '../syntax-problem-with';
import { IDL_DOCS_HEADERS } from './docs.interface';
import { ExtractDocs } from './extract-docs';
import { IDocs } from './extract-docs.interface';
import { GenerateRoutineMetadata } from './generate-routine-metadata';
import { RoutineType } from './generate-routine-metadata.interface';
import { DocsToMarkdown } from './markdown/docs-to-markdown';
import { MARKDOWN_TYPE_LOOKUP } from './markdown/docs-to-markdown.interface';

/**
 * Function that will, given an array of comments from a comment block:
 *
 * 1. Extract docs
 * 2. Check for arguments and keywords
 * 3. Validate the inputs/outputs for routine
 * 4. Format as markdown and return
 * 5. Report any docs issues via syntax problems
 *
 */
export function GenerateRoutineDocsAndMetadata(
  type: RoutineType,
  routine: IBranch<RoutineProcedureToken | RoutineFunctionToken>,
  nameToken: IBranch<RoutineNameToken | RoutineMethodNameToken>,
  problems: SyntaxProblems,
  structures: IGlobalIndexedToken<GlobalStructureToken>[],
  commentBlock?: IBranch<CommentBlockToken>
) {
  /** Flag for if we have comments */
  const hasComments = commentBlock !== undefined;

  // initialize docs value
  let docs: IDocs = {};

  // check if we have docs to extract
  if (hasComments) {
    docs = ExtractDocs(commentBlock.kids as IBasicBranch<CommentToken>[]);
  }

  // extract the metadata from our docs for our routine
  const meta = GenerateRoutineMetadata(
    nameToken,
    type,
    docs,
    structures,
    problems
  );

  // set display name
  meta.display = nameToken.match[0];

  // get all of our arguments
  const args = FindDirectBranchChildren(nameToken, TOKEN_NAMES.ARG_DEFINITION);

  // lookup for args for easy comparison
  const argLookup: { [key: string]: number } = {};
  const orderedArgs: IParameterLookup = {};
  for (let i = 0; i < args.length; i++) {
    // get the argument
    const argName = args[i].match[0].toLowerCase();

    // save in lookup for later comparison
    argLookup[argName] = i;

    // check for missing arguments in our docs
    if (!(argName in meta.args)) {
      // report problem if we have user comments
      if (hasComments) {
        problems.push(
          SyntaxProblemWithoutTranslation(
            IDL_PROBLEM_CODES.PARAMETER_IS_MISSING_FROM_DOCS,
            `${
              IDL_TRANSLATION.parsing.errors[
                IDL_PROBLEM_CODES.PARAMETER_IS_MISSING_FROM_DOCS
              ]
            }: "${argName}"`,
            args[i].pos,
            args[i].pos
          )
        );
      }

      // set default
      orderedArgs[argName] = {
        docs: '',
        private: false,
        source: GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL,
        type: ParseIDLType(DEFAULT_DATA_TYPE),
        direction: 'bidirectional',
        req: true,
        display: args[i].match[0],
        code: true,
        pos: args[i].pos,
      };
    } else {
      orderedArgs[argName] = meta.args[argName];
      orderedArgs[argName].code = true;
      orderedArgs[argName].pos = args[i].pos;
    }
  }

  // process any other args we found that were not from code
  const argKeys = Object.keys(meta.args);
  for (let i = 0; i < argKeys.length; i++) {
    if (!(argKeys[i] in orderedArgs)) {
      orderedArgs[argKeys[i]] = meta.args[argKeys[i]];
      meta.args[argKeys[i]].code = false;
    }
  }

  // update metadata with ordered list
  meta.args = orderedArgs;

  // get all of our keywords
  const kws = FindDirectBranchChildren(
    nameToken,
    TOKEN_NAMES.KEYWORD_DEFINITION
  );

  // map keywords to object for quick lookup
  const kwLookup: { [key: string]: number } = {};
  for (let i = 0; i < kws.length; i++) {
    // get the argument
    const kwName = kws[i].match[0].toLowerCase();

    // save in lookup for later comparison
    kwLookup[kwName] = i;

    // check for missing arguments in our docs
    if (!(kwName in meta.kws)) {
      // report problem if we have user comments
      if (hasComments) {
        problems.push(
          SyntaxProblemWithoutTranslation(
            IDL_PROBLEM_CODES.PARAMETER_IS_MISSING_FROM_DOCS,
            `${
              IDL_TRANSLATION.parsing.errors[
                IDL_PROBLEM_CODES.PARAMETER_IS_MISSING_FROM_DOCS
              ]
            }: "${kwName}"`,
            kws[i].pos,
            kws[i].pos
          )
        );
      }

      // set default
      meta.kws[kwName] = {
        docs: '',
        private: false,
        source: GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL,
        type: ParseIDLType(DEFAULT_DATA_TYPE),
        direction: 'bidirectional',
        req: false,
        display: kws[i].match[0],
        code: true,
        pos: kws[i].pos,
      };
    } else {
      meta.kws[kwName].code = true;
      meta.kws[kwName].pos = kws[i].pos;
    }
  }

  // make docs while including the return type
  meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
    meta,
    name: nameToken.match[0],
  });

  // return if we dont have docs
  if (!hasComments) {
    return meta;
  }

  // check if we need to make sure that we have a return value
  if (type === 'function') {
    if (!(IDL_DOCS_HEADERS.RETURNS in docs)) {
      problems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.RETURNS_MISSING_FROM_DOCS,
          commentBlock.pos,
          commentBlock.end ? commentBlock.end.pos : commentBlock.pos
        )
      );
    }
  } else {
    // if procedure, we do not need the returns statement
    if (IDL_DOCS_HEADERS.RETURNS in docs) {
      // report problem
      problems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.RETURN_DOCS_NOT_NEEDED,
          commentBlock.pos,
          commentBlock.end ? commentBlock.end.pos : commentBlock.pos
        )
      );

      // delete
      delete docs[IDL_DOCS_HEADERS.RETURNS];
    }
  }

  // handle arguments being present or absent
  switch (true) {
    // args, but no documented arguments
    case args.length !== 0 && !(IDL_DOCS_HEADERS.ARGS in docs):
      problems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.ARGS_MISSING_FROM_DOCS,
          commentBlock.pos,
          commentBlock.end ? commentBlock.end.pos : commentBlock.pos
        )
      );
      break;
    // documented arguments, but no args
    case args.length === 0 && IDL_DOCS_HEADERS.ARGS in docs:
      problems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.NO_ARGS_TO_DOCUMENT,
          docs[IDL_DOCS_HEADERS.ARGS].pos,
          docs[IDL_DOCS_HEADERS.ARGS].end
        )
      );
      break;
    // have both
    default: {
      break;
    }
  }

  // handle keywords being present or absent
  switch (true) {
    // kws, but no documented kws
    case kws.length !== 0 && !(IDL_DOCS_HEADERS.KEYWORDS in docs):
      problems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.KEYWORDS_MISSING_FROM_DOCS,
          commentBlock.pos,
          commentBlock.end ? commentBlock.end.pos : commentBlock.pos
        )
      );
      break;
    // documented kws, but no kws
    case kws.length === 0 && IDL_DOCS_HEADERS.KEYWORDS in docs:
      problems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.NO_KEYWORDS_TO_DOCUMENT,
          docs[IDL_DOCS_HEADERS.KEYWORDS].pos,
          docs[IDL_DOCS_HEADERS.KEYWORDS].end
        )
      );
      break;
    // have both
    default: {
      break;
    }
  }

  // return our metadata
  return meta;
}
