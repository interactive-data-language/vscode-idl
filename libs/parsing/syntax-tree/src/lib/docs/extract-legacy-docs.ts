import { CommentToken, GetMatchesArray } from '@idl/parsing/tokenizer';
import { deepEqual } from 'fast-equals';

import { IBasicBranch } from '../branches.interface';
import { IDL_DOCS_HEADERS } from './docs.interface';
import {
  HEADER_TAG_LEGACY,
  LEGACY_PARAMETER_DIRECTION,
  LEGACY_PARAMETER_NAME_SPLIT,
} from './docs.regex.interface';
import {
  END_COMMENT_BLOCK_REGEX,
  IDocs,
  IHeaderDocs,
  REMOVE_COMMENT_REGEX,
} from './extract-docs.interface';
import { IDL_HEADER_MAP } from './header-map.interface';

/**
 * When we don't have anything extra within our docs, we attempt
 * to parse using the legacy docs format of "@param" style similar
 * to how JS/TS create docs
 */
export function ExtractLegacyDocs(
  comments: IBasicBranch<CommentToken>[],
  blocks: IDocs
): IDocs {
  /**
   * Check if we actually parsed the docs
   */
  if (!deepEqual(Object.keys(blocks), [IDL_DOCS_HEADERS.DEFAULT])) {
    return;
  }

  /**
   * Get the docs
   */
  const defaultBlock = blocks[IDL_DOCS_HEADERS.DEFAULT];

  /**
   * Get actual strings for the docs
   */
  const docs = defaultBlock.docs;

  // loop through docs and see if we have legacy docs to post-process
  let hasLegacyDocs = false;

  // process each line
  for (let i = 0; i < docs.length; i++) {
    if (HEADER_TAG_LEGACY.test(docs[i])) {
      hasLegacyDocs = true;
      break;
    }
  }

  // if we dont have any legacy docs, return
  if (!hasLegacyDocs) {
    return;
  }

  // reset default block
  blocks[IDL_DOCS_HEADERS.DEFAULT] = {
    pos: comments[0].pos,
    matches: [],
    end: comments[0].pos,
    docs: [],
    comments: [],
    type: 'idldoc-legacy',
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

  /** Current header key */
  let key: string;

  // check for
  for (let i = 0; i < comments.length; i++) {
    // extract line
    line = comments[i].match[0];

    // skip if the end of our comments
    if (END_COMMENT_BLOCK_REGEX.test(line)) {
      break;
    }

    // get length
    l1 = line.length;

    // cleanup our line
    line = line.replace(REMOVE_COMMENT_REGEX, '');

    // get position offset for where we start
    startLoc = l1 - line.length;

    // check if we have a new header or not
    match = HEADER_TAG_LEGACY.exec(line);
    if (match !== null) {
      // get the key
      key = match[1].toLowerCase();
      if (key in IDL_HEADER_MAP) {
        key = IDL_HEADER_MAP[key];
      }

      /**
       * Check if we have a new key or an existing one
       */
      if (key in blocks) {
        lastFound = blocks[key];
      } else {
        /**
         * Make new key
         */

        // make new last found
        lastFound = {
          pos: [
            comments[i].pos[0],
            match.index + 1 + startLoc,
            match[0].length,
          ],
          matches: GetMatchesArray(match),
          end: [
            comments[i].pos[0],
            match.index + 1 + startLoc,
            match[0].length,
          ],
          docs: [],
          comments: [],
          type: 'idldoc-legacy',
        };

        // save our new block
        blocks[key] = lastFound;
      }

      // get the text afterwards if we have any
      const after = line.substring(match.index + match[0].length).trim();
      if (after !== '') {
        /**
         * Do we have a parameter that we need to map to the IDL doc format?
         */
        if (
          key === IDL_DOCS_HEADERS.ARGS ||
          key === IDL_DOCS_HEADERS.KEYWORDS
        ) {
          // get parameter name
          const nameMatch = LEGACY_PARAMETER_NAME_SPLIT.exec(after);
          const name = nameMatch !== null ? nameMatch[0] : '';

          // put official RST docs
          lastFound.docs.push(
            `   ${name}: ${
              LEGACY_PARAMETER_DIRECTION.test(after) ? 'in' : 'bidirectional'
            }, required, any`
          );
          lastFound.comments.push(comments[i]);

          // save description
          lastFound.docs.push(
            '     ' +
              after
                .substring(name.length)
                .replace(LEGACY_PARAMETER_DIRECTION, '')
                .trim()
          );
          lastFound.comments.push(comments[i]);
        } else {
          lastFound.docs.push(after);
          lastFound.comments.push(comments[i]);
        }

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
      lastFound.docs.push(
        key === IDL_DOCS_HEADERS.ARGS || key === IDL_DOCS_HEADERS.KEYWORDS
          ? `    ${line}`
          : line
      );
      lastFound.comments.push(comments[i]);
    }

    // update the last line we found text on
    // add a bonus "+1" because we should have our comment on the first line stripped out
    lastFound.end = [comments[i].pos[0], 0, line.length + startLoc];
  }
}
