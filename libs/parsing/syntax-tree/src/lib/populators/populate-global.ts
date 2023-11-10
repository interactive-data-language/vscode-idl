import { CancellationToken } from '@idl/cancellation-tokens';
import {
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  GlobalProcedureMethodToken,
  GlobalProcedureToken,
  GlobalStructureToken,
  IFunctionMetadata,
  IGlobalIndexedToken,
  IRoutineMetadata,
  ParseIDLType,
} from '@idl/data-types/core';
import {
  CommentBlockToken,
  RoutineFunctionToken,
  RoutineMethodNameToken,
  RoutineNameToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import copy from 'fast-copy';

import { IBranch } from '../branches.interface';
import { IParsed } from '../build-syntax-tree.interface';
import { GenerateRoutineDocsAndMetadata } from '../docs/generate-routine-docs-and-metadata';
import { GenerateRoutineMetadataFast } from '../docs/generate-routine-metadata-fast';
import { FindStructureDefs } from './find-structure-defs';
import { GetCompileOpts } from './get-compile-opts';
import { GetUniqueVariables } from './get-unique-variables';
import { MAIN_LEVEL_NAME } from './populate-global.interface';
import { LOCAL_TOKEN_LOOKUP } from './populate-local.interface';
import { PopulateLocalForMain } from './populate-local-for-main';

/**
 * Populates a lookup with quick information for where things are defined
 */
export function PopulateGlobalLocalCompileOpts(
  parsed: IParsed,
  cancel: CancellationToken,
  full: boolean,
  isNotebook: boolean
) {
  // get global placeholder
  const global = parsed.global;

  // reverse array
  parsed.tree.reverse();

  // extract our tree from the bottom up
  const tree = parsed.tree;

  /** Track found structures */
  const found: { [key: string]: any } = {};

  // initialize docs
  let docs: IBranch<CommentBlockToken> = undefined;

  // process all of the direct children in our tree
  for (let i = 0; i < tree.length; i++) {
    // check for cancel
    cancel.throwIfCancelled();

    // extract our branch
    const branch = tree[i];

    // check for routine docs for args/keywords
    if (i < tree.length - 1) {
      if (tree[i + 1].name === TOKEN_NAMES.COMMENT_BLOCK) {
        docs = tree[i + 1] as IBranch<CommentBlockToken>;
      } else {
        docs = undefined;
      }
    }

    // init array for structures
    let structures: IGlobalIndexedToken<GlobalStructureToken>[] = [];

    // determine how to proceed
    switch (branch.name) {
      // handle functions
      case TOKEN_NAMES.ROUTINE_FUNCTION:
        // make sure we have children
        if (branch.kids.length > 0) {
          // get our first child
          const first = branch.kids[0];

          const name = first.match[0].toLowerCase();

          // get structure definitions or use empty array
          if (full) {
            structures = FindStructureDefs(branch, name, found);
          }

          // check for comments within routines
          if (branch.kids[1]?.name === TOKEN_NAMES.COMMENT_BLOCK) {
            docs = branch.kids[1];
          }

          // generate metadata
          const meta = full
            ? GenerateRoutineDocsAndMetadata(
                'function',
                branch,
                first as IBranch<RoutineNameToken | RoutineMethodNameToken>,
                parsed.parseProblems,
                structures,
                docs
              )
            : GenerateRoutineMetadataFast('function');

          // check if method or function
          switch (first.name) {
            case TOKEN_NAMES.ROUTINE_NAME: {
              // make our token
              const add: IGlobalIndexedToken<GlobalFunctionToken> = {
                type: GLOBAL_TOKEN_TYPES.FUNCTION,
                name,
                pos: first.pos,
                meta: meta as IFunctionMetadata,
              };
              global.push(add);
              parsed.compile.func[name] = full ? GetCompileOpts(branch) : [];
              parsed.local.func[name] = full
                ? GetUniqueVariables(
                    branch as IBranch<RoutineFunctionToken>,
                    parsed,
                    parsed.compile.func[name],
                    add
                  )
                : {};
              break;
            }
            case TOKEN_NAMES.ROUTINE_METHOD_NAME: {
              // split our method name
              const hiSplit = first.match[0].split('::');
              const split = first.match[0].toLowerCase().split('::');

              // make our token
              const add: IGlobalIndexedToken<GlobalFunctionMethodToken> = {
                type: GLOBAL_TOKEN_TYPES.FUNCTION_METHOD,
                name,
                pos: first.pos,
                meta: {
                  className: split[0],
                  method: split[1],
                  ...(meta as IFunctionMetadata),
                },
              };
              global.push(add);

              // check if we have a function method
              if (split[1] === 'init') {
                const returnType = ParseIDLType(hiSplit[0]);

                // update returns for method
                add.meta.returns = returnType;

                // copy and add another token for a function
                const globalFunc: IGlobalIndexedToken<GlobalFunctionToken> = {
                  type: GLOBAL_TOKEN_TYPES.FUNCTION,
                  name: split[0],
                  pos: first.pos,
                  meta: {
                    ...(meta as IFunctionMetadata),
                    display: hiSplit[0],
                    returns: returnType,
                  },
                };
                global.push(globalFunc);
              }

              parsed.compile.func[name] = full ? GetCompileOpts(branch) : [];
              parsed.local.func[name] = full
                ? GetUniqueVariables(
                    branch as IBranch<RoutineFunctionToken>,
                    parsed,
                    parsed.compile.func[name],
                    add
                  )
                : {};

              // add "self" as a variable
              parsed.local.func[name]['self'] = {
                type: LOCAL_TOKEN_LOOKUP.VARIABLE,
                name: 'self',
                pos: first.pos,
                meta: {
                  display: 'self',
                  isDefined: true,
                  docs: IDL_TRANSLATION.docs.hover.params.self,
                  source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
                  type: ParseIDLType(split[0]),
                  usage: [],
                },
              };
              break;
            }
            default:
              // do nothing
              break;
          }
        }
        break;
      // handle procedures
      case TOKEN_NAMES.ROUTINE_PROCEDURE:
        // make sure we have children
        if (branch.kids.length > 0) {
          // get our first child
          const first = branch.kids[0];

          // get the name
          const name = first.match[0].toLowerCase();

          // get structure definitions or use empty array
          if (full) {
            structures = FindStructureDefs(branch, name, found);
          }

          // check for comments within routines
          if (branch.kids[1]?.name === TOKEN_NAMES.COMMENT_BLOCK) {
            docs = branch.kids[1];
          }

          // generate metadata
          const meta = full
            ? GenerateRoutineDocsAndMetadata(
                'procedure',
                branch,
                first as IBranch<RoutineNameToken | RoutineMethodNameToken>,
                parsed.parseProblems,
                structures,
                docs
              )
            : GenerateRoutineMetadataFast('procedure');

          // make sure it is the name of the routine
          switch (first.name) {
            case TOKEN_NAMES.ROUTINE_NAME: {
              // make our token
              const add: IGlobalIndexedToken<GlobalProcedureToken> = {
                type: GLOBAL_TOKEN_TYPES.PROCEDURE,
                name,
                pos: first.pos,
                meta: meta as IRoutineMetadata,
              };
              global.push(add);
              parsed.compile.pro[name] = full ? GetCompileOpts(branch) : [];
              parsed.local.pro[name] = full
                ? GetUniqueVariables(
                    branch as IBranch<RoutineProcedureToken>,
                    parsed,
                    parsed.compile.pro[name],
                    add
                  )
                : {};
              break;
            }
            case TOKEN_NAMES.ROUTINE_METHOD_NAME: {
              // split our method name
              const split = first.match[0].toLowerCase().split('::');

              // make our token
              const add: IGlobalIndexedToken<GlobalProcedureMethodToken> = {
                type: GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
                name,
                pos: first.pos,
                meta: {
                  className: split[0],
                  method: split[1],
                  ...(meta as IRoutineMetadata),
                },
              };
              global.push(add);
              parsed.compile.pro[name] = full ? GetCompileOpts(branch) : [];
              parsed.local.pro[name] = full
                ? GetUniqueVariables(
                    branch as IBranch<RoutineProcedureToken>,
                    parsed,
                    parsed.compile.pro[name],
                    add
                  )
                : {};

              // add "self" as a variable
              parsed.local.pro[name]['self'] = {
                type: LOCAL_TOKEN_LOOKUP.VARIABLE,
                name: 'self',
                pos: first.pos,
                meta: {
                  display: 'self',
                  isDefined: true,
                  docs: IDL_TRANSLATION.docs.hover.params.self,
                  source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
                  type: ParseIDLType(split[0]),
                  usage: [],
                },
              };
              break;
            }
            default:
              // do nothing
              break;
          }
        }
        break;
      // custom case for main level programs so they end up in our outline
      case TOKEN_NAMES.MAIN_LEVEL: {
        const add: IGlobalIndexedToken<GlobalProcedureToken> = {
          type: GLOBAL_TOKEN_TYPES.PROCEDURE,
          name: MAIN_LEVEL_NAME,
          pos: branch.pos,
          meta: {
            display: MAIN_LEVEL_NAME,
            docs: 'Main level program',
            docsLookup: {},
            args: {},
            kws: {},
            source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
            struct: copy(structures),
          },
        };
        global.push(add);
        parsed.compile.main = full ? GetCompileOpts(branch) : [];

        // if we are a notebook, add main level program
        if (isNotebook) {
          if (parsed.compile.main.indexOf('idl2') === -1) {
            parsed.compile.main.push('idl2');
          }
        }
        break;
      }
      default:
        // do nothing
        break;
    }

    // add structures to global tokens
    for (let z = 0; z < structures.length; z++) {
      parsed.global.push(structures[z]);
    }
  }

  // reverse back
  parsed.tree.reverse();

  // populate local vars for main
  // separate because we have errors from reversal if we dont wait
  if (full) {
    PopulateLocalForMain(parsed);
  }
}
