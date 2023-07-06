import {
  BRANCH_TYPES,
  IParsed,
  MakeSpaces,
  SyntaxTree,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Branches that we skip
 */
const SKIP_BRANCHES: { [key: string]: any } = {};
SKIP_BRANCHES[TOKEN_NAMES.COMMENT_BLOCK] = true;

/**
 * Routine that recurses and manages converting our code to strings
 */
function _Recursor(tree: SyntaxTree, strings: { [key: number]: string }) {
  /** Line for our current token */
  let line = -1;

  // process all tokens
  for (let i = 0; i < tree.length; i++) {
    // get our token line
    line = tree[i].pos[0];

    // init string if it doesnt exists
    if (!(line in strings)) {
      strings[line] = '';
    }

    // add string
    if (!(tree[i].name in SKIP_BRANCHES)) {
      strings[line] += `${MakeSpaces(tree[i].pos[1] - strings[line].length)}${
        tree[i].match[0] || ''
      }`;
    }

    // check branch type
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      /** Get branch, typed for convenience */
      const branch = tree[i] as TreeBranchToken;

      // process our children
      _Recursor(branch.kids, strings);

      // check for an end
      if (branch.end !== undefined && !(tree[i].name in SKIP_BRANCHES)) {
        line = branch.end.pos[0];

        // init string if it doesnt exists
        if (!(line in strings)) {
          strings[line] = '';
        }

        // add string
        strings[line] +=
          MakeSpaces(branch.end.pos[1] - strings[line].length) +
          (branch.end.match[0] || '');
      }
    }
  }
}

/**
 * Combines code that has had styling and basic formatting applied
 *
 * This creates our "mechanical" structure of the code
 */
export function CombinerBasic(parsed: IParsed): string[] {
  // initialize strings by line
  const byLine: { [key: number]: string } = {};

  // convert tokens back to strings
  _Recursor(parsed.tree, byLine);

  // combine to strings
  const strings: string[] = [];

  // get all of our lines
  const lines = Object.keys(byLine);

  /** Last line we created text for */
  const lastLine = lines.length > 0 ? +lines[lines.length - 1] : 0;

  // process all of our lines
  for (let i = 0; i < lastLine + 1; i++) {
    strings.push(i in byLine ? byLine[i] : '');
  }

  return strings;
}
