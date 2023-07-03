import {
  BRANCH_TYPES,
  END_COMMENT_BLOCK_REGEX,
  IBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  START_COMMENT_BLOCK,
  SyntaxTree,
} from '@idl/parsing/syntax-tree';
import { CommentBlockToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

/**
 * Recurses our syntax tree and turns comments into comment blocks
 */
function CommentExtractorRecursor(tree: SyntaxTree) {
  // track location of children that we are going to remove and make a new tree from
  let start = -1;
  let count = 0;

  // check flag if we found a comment block or not
  let foundIt = false;

  // track our upper limit for iterator since our index will change
  const upper = tree.length;

  // init flag for us stopping our block
  let shouldEnd = false;

  // track the number of deleted elements so we have the right index
  let offset = 0;

  // process each tree
  for (let j = 0; j < upper; j++) {
    // get our index
    const i = j - offset;

    // check if we need to bail
    if (i >= tree.length) {
      break;
    }

    // extract our node - make variable because we will be adjusting our index
    const node = tree[i];

    // update flag for ending
    shouldEnd = false;

    // check if we have a comment
    if (node.name === TOKEN_NAMES.COMMENT) {
      switch (true) {
        case foundIt:
          count++;
          break;
        case START_COMMENT_BLOCK.test(node.match[0]):
          foundIt = true;
          start = i;
          count = 1;
          break;
        default:
          break;
      }

      // check if we need to stop
      shouldEnd = END_COMMENT_BLOCK_REGEX.test(node.match[0]);
    }

    // check if we need to close our block
    if (node.name !== TOKEN_NAMES.COMMENT || shouldEnd) {
      // reset our flag for
      foundIt = false;

      // see if we have children to finish
      if (count > 0) {
        // create our new branch
        const block: IBranch<CommentBlockToken> = {
          type: BRANCH_TYPES.BRANCH,
          name: TOKEN_NAMES.COMMENT_BLOCK,
          pos: [0, 0, 0],
          match: [],
          idx: i,
          scope: [],
          parseProblems: [],
          end: {
            match: [],
            pos: [0, 0, 0],
          },
          kids: [],
        };

        // extract children
        const children = tree.splice(start, count, block);

        // update properties
        block.kids = children;
        block.pos = copy(children[0].pos);
        block.match = children.map((child) => child.match[0]);
        block.end = {
          match: [],
          pos: copy(children[children.length - 1].pos),
        };

        // update our offset
        offset += count - 1;

        // reset
        count = 0;
      }
    }

    // check if we need to recurse
    if (
      node.type === BRANCH_TYPES.BRANCH &&
      node.name !== TOKEN_NAMES.COMMENT_BLOCK
    ) {
      CommentExtractorRecursor((node as IBranch<any>).kids);
    }
  }
}

/**
 * Convert comments to comment blocks
 */
IDL_SYNTAX_TREE_POST_PROCESSOR.onTree((tree) => {
  CommentExtractorRecursor(tree);
});
