import {
  DEFAULT_DATA_TYPE,
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GlobalStructureToken,
  IGlobalIndexedToken,
  ParseIDLType,
} from '@idl/data-types/core';
import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import {
  RoutineMethodNameToken,
  RoutineNameToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import copy from 'fast-copy';

import { IBranch } from '../branches.interface';
import { FindDirectBranchChildren } from '../helpers/searching/find-direct-branch-children';
import {
  SyntaxProblemWithoutTranslation,
  SyntaxProblemWithTranslation,
} from '../syntax-problem-with';
import { IDL_DOCS_HEADERS } from './docs.interface';
import { IDocs } from './extract-docs.interface';
import { ExtractParameterDocs } from './extract-parameter-docs';
import {
  FunctionRoutineType,
  ProcedureRoutineType,
  RoutineMetadata,
  RoutineType,
} from './generate-routine-metadata.interface';
import { JoinDocs } from './join-docs';

/**
 * Takes comments from a comment block and converts it into
 * documentation for things like hover help and auto-complete.
 */
export function GenerateRoutineMetadata<T extends RoutineType>(
  nameToken: IBranch<RoutineNameToken | RoutineMethodNameToken>,
  type: T,
  docs: IDocs,
  structures: IGlobalIndexedToken<GlobalStructureToken>[],
  problems: SyntaxProblems
): RoutineMetadata<T> {
  // initialize metadata
  let meta: RoutineMetadata<T>;

  // get structure names
  const structNames = structures.map((s) => s.name);
  const foundStructures: boolean[] = new Array(structures.length).fill(false);

  // populate based on values - typescript has a bug or something
  // auto-complete works, but it complains when you try to set directly
  // so we strictly type things here and work around the problem
  if (type === 'procedure') {
    const nonsense: RoutineMetadata<ProcedureRoutineType> = {
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      args: {},
      docs: '',
      docsLookup: {},
      display: '',
      kws: {},
      private: IDL_DOCS_HEADERS.PRIVATE in docs,
      struct: structures,
    };

    // typescript is stupid
    meta = nonsense as RoutineMetadata<T>;
  } else {
    const nonsense: RoutineMetadata<FunctionRoutineType> = {
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      args: {},
      docs: '',
      docsLookup: {},
      display: '',
      kws: {},
      private: IDL_DOCS_HEADERS.PRIVATE in docs,
      returns: ParseIDLType(DEFAULT_DATA_TYPE),
      struct: structures,
    };

    // typescript is stupid
    meta = nonsense as RoutineMetadata<T>;
  }

  // make lookup of docs by header tag
  const docsLookup: { [key: string]: string } = {};

  // save reference to our docs lookup
  meta.docsLookup = docsLookup;

  // get the keys for our docs
  const keys = Object.keys(docs);
  for (let i = 0; i < keys.length; i++) {
    /**
     * Get the problems that we will add to
     *
     * This helps us track what is missing from docs, etc
     *
     * From here we want to have the option to "ignore" problems potentially based
     * on the docs style that they are using
     */
    // const useProblems = docs[keys[i]].type === 'idldoc' ? problems : problems;
    const useProblems = problems;

    // check which key we are processing
    switch (keys[i]) {
      /**
       * Check for arguments
       */
      case IDL_DOCS_HEADERS.ARGS: {
        // get names of our arguments
        const argRef: { [key: string]: string } = {};
        const args = FindDirectBranchChildren(
          nameToken,
          TOKEN_NAMES.ARG_DEFINITION
        );
        for (let z = 0; z < args.length; z++) {
          argRef[args[z].match[0].toLowerCase()] = args[z].match[0];
        }

        // populate docs
        meta.args = ExtractParameterDocs(docs[keys[i]], argRef, useProblems);
        break;
      }

      /**
       * Check for keywords
       */
      case IDL_DOCS_HEADERS.KEYWORDS: {
        // get names of our actual keywords
        const kwRef: { [key: string]: string } = {};
        const kws = FindDirectBranchChildren(
          nameToken,
          TOKEN_NAMES.KEYWORD_DEFINITION
        );
        for (let z = 0; z < kws.length; z++) {
          kwRef[kws[z].match[0].toLowerCase()] = kws[z].match[0];
        }

        // populate docs
        meta.kws = ExtractParameterDocs(docs[keys[i]], kwRef, useProblems);
        break;
      }

      /**
       * All other blocks
       */
      default: {
        // check for matching structure name
        const sIdx = structNames.indexOf(keys[i].toLowerCase());
        if (sIdx !== -1) {
          // update flag that we process this structure
          foundStructures[sIdx] = true;

          // get old properties to do validation
          const oldProps = structures[sIdx].meta.props;

          // map old properties to display names
          const refProps: { [key: string]: string } = {};
          const keysProps = Object.keys(oldProps);
          for (let z = 0; z < keysProps.length; z++) {
            refProps[keysProps[z]] = oldProps[keysProps[z]].display;
          }

          // extract docs
          structures[sIdx].meta.props = ExtractParameterDocs(
            docs[keys[i]],
            refProps,
            useProblems,
            true
          );

          // check if we have a property missing from our docs
          // the original properties are from our code
          const oldKeys = Object.keys(oldProps);
          for (let z = 0; z < oldKeys.length; z++) {
            if (!(oldKeys[z] in structures[sIdx].meta.props)) {
              // save original property definition
              structures[sIdx].meta.props[oldKeys[z]] = oldProps[oldKeys[z]];

              // report problem
              useProblems.push(
                SyntaxProblemWithoutTranslation(
                  IDL_PROBLEM_CODES.PROPERTY_MISSING_FROM_DOCS,
                  `${
                    IDL_TRANSLATION.parsing.errors[
                      IDL_PROBLEM_CODES.PROPERTY_MISSING_FROM_DOCS
                    ]
                  }: "${oldProps[oldKeys[z]].display}"`,
                  oldProps[oldKeys[z]].pos,
                  oldProps[oldKeys[z]].pos
                )
              );
            } else {
              structures[sIdx].meta.props[oldKeys[z]].pos =
                oldProps[oldKeys[z]].pos;
              structures[sIdx].meta.props[oldKeys[z]].code = true;
            }
          }
        } else {
          docsLookup[keys[i]] = JoinDocs(
            docs[keys[i]].docs,
            docs[keys[i]].comments,
            useProblems
          );
        }
        break;
      }
    }
  }

  // check for missing structures if we had docs
  if (keys.length > 0) {
    for (let i = 0; i < foundStructures.length; i++) {
      if (!foundStructures[i]) {
        problems.push(
          SyntaxProblemWithoutTranslation(
            IDL_PROBLEM_CODES.MISSING_STRUCTURE_FROM_DOCS,
            `${
              IDL_TRANSLATION.parsing.errors[
                IDL_PROBLEM_CODES.MISSING_STRUCTURE_FROM_DOCS
              ]
            }: "${structures[i].meta.display}"`,
            structures[i].pos,
            structures[i].pos
          )
        );
      }
    }
  }

  // make a copy of the structures to reduce references once we set properties
  meta.struct = copy(meta.struct);

  // determine how to proceed based on the routine type
  switch (true) {
    case type === 'procedure':
      return meta;
    case type === 'function': {
      // initialize data type
      let returnType = DEFAULT_DATA_TYPE;

      /**
       * Check if we have docs for returns. This is checked above where we are
       * called because we don't have access to the original comment block in
       * here, nor do we need it
       */
      if (IDL_DOCS_HEADERS.RETURNS in docs) {
        // get the block
        const returns = docs[IDL_DOCS_HEADERS.RETURNS];

        // get the docs
        const returnDocs = returns.docs.filter((doc) => doc.trim() !== '');

        // validate docs
        switch (true) {
          case returns.type !== 'idldoc':
            // do nothing
            break;
          case returnDocs.length === 0:
            problems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.RETURN_DOCS_MISSING_TYPE,
                returns.pos,
                returns.end
              )
            );
            break;
          case returnDocs.length > 1:
            problems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.RETURN_DOCS_INVALID,
                returns.pos,
                returns.end
              )
            );
            break;
          default:
            returnType = returnDocs[0].trim();
            break;
        }

        // // TODO: verify that the type is correct
        // if (IsValidType(compare)) {
        //   lastFound.dataType = compare;
        // } else {
        //   // PROBLEM
        //   syntax.push(
        //     ProblemWithTranslation(
        //       IDL_PROBLEM_CODES.INVALID_TYPE_DOCS,
        //       pos,
        //       pos
        //     )
        //   );
        // }
      }

      // create function metadata
      const fMeta: RoutineMetadata<FunctionRoutineType> = {
        ...meta,
        returns: ParseIDLType(returnType),
      };

      return fMeta;
    }
    default:
      break;
  }
}
