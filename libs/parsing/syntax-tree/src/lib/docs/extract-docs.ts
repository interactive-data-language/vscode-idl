import { CommentToken, GetMatchesArray } from '@idl/parsing/tokenizer';

import { IBasicBranch } from '../branches.interface';
import { IDL_DOCS_HEADERS } from './docs.interface';
import { HEADER_TAG } from './docs.regex.interface';
import {
  END_COMMENT_BLOCK_REGEX,
  IDocs,
  IHeaderDocs,
  REMOVE_COMMENT_REGEX,
} from './extract-docs.interface';
import { IDL_HEADER_MAP } from './header-map.interface';

/**
 * Takes comments from a comment block and converts it into
 * documentation for things like hover help and auto-complete.
 */
export function ExtractDocs(comments: IBasicBranch<CommentToken>[]): IDocs {
  /** Track code by blocks */
  const blocks: IDocs = {};

  // initialize a default block
  blocks[IDL_DOCS_HEADERS.DEFAULT] = {
    pos: comments[0].pos,
    matches: [],
    end: comments[0].pos,
    docs: [],
    comments: [],
  };

  /** Track the last found block which we will save text to if a new block is not found */
  let lastFound: IHeaderDocs = blocks[IDL_DOCS_HEADERS.DEFAULT];

  /** Match for testing string */
  let match: RegExpExecArray;

  /** Line of code we are processing */
  let line: string;

  /** length of our line */
  let l1 = 0;

  /** Starting location of our comment (with actual comment character removed) */
  let startLoc = 0;

  /** Flag that controls when we start saving text for docs to filter out empty lines */
  let startSaving = false;

  // check for
  for (let i = 0; i < comments.length; i++) {
    // extract line
    line = comments[i].match[0];

    // skip if the end of our comments
    if (END_COMMENT_BLOCK_REGEX.test(line)) {
      continue;
    }

    // get length
    l1 = line.length;

    // cleanup our line
    line = line.replace(REMOVE_COMMENT_REGEX, '');

    // get position offset for where we start
    startLoc = l1 - line.length;

    // check if we have a new header or not
    match = HEADER_TAG.exec(line);
    if (match !== null) {
      // make new last found
      lastFound = {
        pos: [comments[i].pos[0], match.index + 1 + startLoc, match[0].length],
        matches: GetMatchesArray(match),
        end: [comments[i].pos[0], match.index + 1 + startLoc, match[0].length],
        docs: [],
        comments: [],
      };

      // get the key
      let key = match[1].toLowerCase();
      if (key in IDL_HEADER_MAP) {
        key = IDL_HEADER_MAP[key];
      }

      // save our new block
      blocks[key] = lastFound;

      // get the text afterwards if we have any
      const after = line.substring(match.index + match[0].length).trim();
      if (after !== '') {
        lastFound.docs.push(after);
        lastFound.comments.push(comments[i]);
        startSaving = true;
      }

      // skip to next line
      continue;
    }

    // update our flag looking for the first non-empty line
    if (!startSaving) {
      startSaving = line !== '';
    }

    // save line
    if (startSaving) {
      lastFound.docs.push(line);
      lastFound.comments.push(comments[i]);
    }

    // update the last line we found text on
    // add a bonus "+1" because we should have our comment on the first line stripped out
    lastFound.end = [comments[i].pos[0], 0, line.length + startLoc];
  }

  return blocks;
}
