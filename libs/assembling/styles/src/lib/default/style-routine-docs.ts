import { ICodeStyle } from '@idl/assembling/config';
import { IncrementLineNumbers } from '@idl/assembling/shared';
import {
  BRANCH_TYPES,
  DocsToIDL,
  IBranch,
  IParsed,
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  CommentBlockToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  GlobalProcedureMethodToken,
  GlobalProcedureToken,
  GlobalRoutineToken,
  IGlobalIndexedToken,
} from '@idl/types/core';

import { FormatKeyword } from './style-keywords';

/**
 * Global tokens for function types
 */
const FUNCTION_TYPES: { [key: string]: boolean } = {};
FUNCTION_TYPES[GLOBAL_TOKEN_TYPES.FUNCTION] = true;
FUNCTION_TYPES[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD] = true;

/**
 * Global tokens for procedures
 */
const PROCEDURE_TYPES: { [key: string]: boolean } = {};
PROCEDURE_TYPES[GLOBAL_TOKEN_TYPES.PROCEDURE] = true;
PROCEDURE_TYPES[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD] = true;

/**
 * Finds our matching global token based on a tree token
 */
function GetMatchingGlobalToken(
  routine: TreeToken<RoutineProcedureToken | RoutineFunctionToken>,
  parsed: IParsed
): GlobalRoutineToken | undefined {
  /** Extract the name of our routine which needs to descend the tree */
  let name: string;
  if (routine.kids.length > 0) {
    // get our first child
    name = routine.kids[0].match[0].toLowerCase();
  }

  // return if no routine name
  if (name === undefined) {
    return undefined;
  }

  // check for match
  for (let i = 0; i < parsed.global.length; i++) {
    const global = parsed.global[i];
    switch (true) {
      case routine.name === TOKEN_NAMES.ROUTINE_FUNCTION: {
        if (global.type in FUNCTION_TYPES && global.name === name) {
          return global as IGlobalIndexedToken<
            GlobalFunctionToken | GlobalFunctionMethodToken
          >;
        }
        break;
      }
      case routine.name === TOKEN_NAMES.ROUTINE_PROCEDURE: {
        if (global.type in PROCEDURE_TYPES && global.name === name) {
          return global as IGlobalIndexedToken<
            GlobalProcedureToken | GlobalProcedureMethodToken
          >;
        }
        break;
      }
      default:
        // do nothing
        break;
    }
  }

  return undefined;
}

/**
 * Tokens that we  check for to replace docs blocks that come before
 */
const REPLACE: { [key: string]: boolean } = {};
REPLACE[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
REPLACE[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;

/**
 * Recurser to replace routine docs with nicely formatted ones
 */
export function ReplaceRoutineDocs(parsed: IParsed, style: ICodeStyle) {
  /** Extract the tree */
  const tree = parsed.tree;

  // craft a new tree with updated elements
  // which is easier than modifying in place which gets
  // a little messy
  const useTree: SyntaxTree = [];

  // add comment blocks for routines that dont have them
  for (let i = 0; i < tree.length; i++) {
    // check if routine
    if (tree[i].name in REPLACE) {
      /**
       * Is the block before?
       */
      const before = tree[i - 1]?.name === TOKEN_NAMES.COMMENT_BLOCK;

      /**
       * is the block after?
       */
      const after =
        (tree[i] as TreeBranchToken)?.kids[1]?.name ===
        TOKEN_NAMES.COMMENT_BLOCK;

      // check if we need to add a comment block
      if (!(before || after)) {
        /** Start of new token */
        const newStartLine = tree[i].pos[0];

        // make a new comment block
        const block: IBranch<CommentBlockToken> = {
          type: BRANCH_TYPES.BRANCH,
          name: TOKEN_NAMES.COMMENT_BLOCK,
          pos: [newStartLine, 0, 0],
          match: [],
          idx: i,
          parseProblems: [],
          scope: [],
          kids: [],
          end: {
            pos: [newStartLine, 0, 0],
            match: [],
          },
        };

        // save the block
        useTree.push(block);
      }
    }

    // always save our node
    useTree.push(tree[i]);
  }

  // process only top level children and dont recurse
  for (let i = 0; i < useTree.length; i++) {
    /** Routine def that we found */
    let routine: TreeToken<RoutineProcedureToken | RoutineFunctionToken>;

    /** Comment block associated with the routine */
    let block: IBranch<CommentBlockToken>;

    /** Track where our comment block resides */
    let before = false;

    /**
     * Check if we have a comment block before
     */
    if (
      useTree[i].name === TOKEN_NAMES.COMMENT_BLOCK &&
      useTree[i + 1]?.name in REPLACE
    ) {
      /** Comment block is before */
      before = true;

      /** Comment block */
      block = useTree[i] as IBranch<CommentBlockToken>;

      /** Extract our routine */
      routine = useTree[i + 1] as TreeToken<
        RoutineProcedureToken | RoutineFunctionToken
      >;
    }

    /**
     * Check if we have a comment block after
     */
    if (
      useTree[i].name in REPLACE &&
      (useTree[i] as TreeBranchToken)?.kids[1]?.name ===
        TOKEN_NAMES.COMMENT_BLOCK
    ) {
      /** Comment block is after */
      before = false;

      /** Extract our routine */
      routine = useTree[i] as TreeToken<
        RoutineProcedureToken | RoutineFunctionToken
      >;

      /** Comment block */
      block = routine.kids[1] as IBranch<CommentBlockToken>;
    }

    // check if we have comment block followed by a routine
    if (routine !== undefined && block !== undefined) {
      /** Get global token */
      const global = GetMatchingGlobalToken(routine, parsed);

      // make sure that we have a global token
      if (global !== undefined) {
        // update the display names for all keywords if we have them
        const kws = Object.values(global.meta.kws);
        for (let j = 0; j < kws.length; j++) {
          kws[j].display = FormatKeyword(kws[j].display, style.keywords);
        }

        // extract our docs
        const docs = DocsToIDL(global);

        // get the number of new lines
        const delta = docs.length - block.kids.length;

        /** Get start line */
        const start = block.pos[0];

        /** Scope for tokens */
        const scope = [...block.scope, TOKEN_NAMES.COMMENT_BLOCK];

        // convert to comment tokens
        const children: SyntaxTree = [];

        // make new comments for our children
        for (let j = 0; j < docs.length; j++) {
          // update start for comment block
          if (j === 0) {
            block.pos = [start, 0, docs[j].length];
          }
          if (j === docs.length - 1) {
            block.end.pos = [start + j, 0, docs[j].length];
          }

          // save
          children.push({
            type: BRANCH_TYPES.BASIC,
            name: TOKEN_NAMES.COMMENT,
            pos: [start + j, 0, docs[j].length],
            match: [docs[j]],
            idx: j,
            parseProblems: [],
            scope: scope,
          });
        }

        // save matches
        block.match = docs;

        // update the comment block's children
        block.kids = children;

        // bump the lines for the next tokens starting at i + 1 which is where our routine
        // token starts
        if (before) {
          IncrementLineNumbers(
            useTree.slice(i + 1),
            // shift and do math to make bottom of docs above routine definition
            delta - (routine.pos[0] + delta - block.end.pos[0] - 1)
          );
        } else {
          routine.end.pos[0] += delta;
          IncrementLineNumbers(routine.kids.slice(2), delta);
          IncrementLineNumbers(useTree.slice(i + 1), delta);
        }
      }
    }
  }

  // update the tree
  parsed.tree = useTree;
}

// /**
//  * Convert neighboring strings to single expression
//  */
// ASSEMBLER_PRE_PROCESSOR.addTreePreProcessor((tree, text) => {
//   ReplaceRoutineDocs(tree);
// });
