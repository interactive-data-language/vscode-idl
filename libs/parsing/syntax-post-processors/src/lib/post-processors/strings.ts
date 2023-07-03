import {
  BRANCH_TYPES,
  IBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  SyntaxTree,
} from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames, TOKEN_NAMES } from '@idl/parsing/tokenizer';

const MERGE: { [key: string]: boolean } = {};
MERGE[TOKEN_NAMES.QUOTE_DOUBLE] = true;
MERGE[TOKEN_NAMES.QUOTE_SINGLE] = true;

/**
 * Recurser to find children
 */
function ReplaceStringsRecurser(tree: SyntaxTree) {
  // get number of elements, track since we may remove
  const n = tree.length;

  // process all trees
  let i: number;
  let offset = 0;

  // process all children
  for (let j = 0; j < n; j++) {
    // get true index
    i = j - offset;

    // recurse if needed
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      ReplaceStringsRecurser((tree[i] as IBranch<NonBasicTokenNames>).kids);
      continue;
    }

    // check for cleanup
    if (i < n - offset - 1) {
      // check for merge test
      if (tree[i].name in MERGE && tree[i].name === tree[i + 1].name) {
        const p1 = tree[i].pos;
        const p2 = tree[i + 1].pos;

        // verify same line and that the second token starts where our first ends
        if (p1[0] === p2[0] && p1[1] + p1[2] === p2[1]) {
          // get combined match
          const combined = `${tree[i].match[0]}${tree[i + 1].match[0]}`;
          tree[i].match = [
            combined,
            combined.substring(1, combined.length - 1),
          ];
          tree[i].idx = i;

          // correct the position of our string
          p1[2] += p2[2];

          // remove
          tree.splice(i + 1, 1);

          // increment offset
          offset++;
        }
      }
    }
  }
}

/**
 * Convert neighboring strings to single expression
 */
IDL_SYNTAX_TREE_POST_PROCESSOR.onTree((tree) => {
  ReplaceStringsRecurser(tree);
});
