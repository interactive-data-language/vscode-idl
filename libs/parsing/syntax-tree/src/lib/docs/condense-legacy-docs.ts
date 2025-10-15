import { CommentToken } from '@idl/tokenizer';
import {
  HEADER_TAG_LEGACY,
  LEGACY_PARAMETER_NAME_SPLIT,
} from '@idl/types/syntax-tree';

import { IBasicBranch } from '../branches.interface';
import { IDL_DOCS_HEADERS } from './docs.interface';
import { REMOVE_COMMENT_REGEX } from './extract-docs.interface';
import { IDL_HEADER_MAP } from './header-map.interface';

/**
 * Merge legacy docs together for keywords and parameters when
 * they are separated onto multiple lines
 */
export function CondenseLegacyDocs(comments: IBasicBranch<CommentToken>[]) {
  /** Line offset to adjust positions */
  let lineOffset = 0;

  /** Track comments to remove */
  let toRemove: number[] = [];

  // process all tags
  for (let i = 0; i < comments.length; i++) {
    // offset our position
    comments[i].pos[0] -= lineOffset;
    comments[i].idx -= lineOffset;

    // remove the comment from the line
    const line = comments[i].match[0].replace(REMOVE_COMMENT_REGEX, '');

    /** Check for header tag */
    const match = HEADER_TAG_LEGACY.exec(line);

    // check for match
    if (match !== null) {
      // normalize the header
      let key = match[1].toLowerCase();
      if (key in IDL_HEADER_MAP) {
        key = IDL_HEADER_MAP[key];
      }

      // get the text after the key
      const after = line.substring(match.index + match[0].length).trim();

      // check the next line if this one doesnt have anything afterwards
      // but only do this for keywords and arguments
      if (
        (key === IDL_DOCS_HEADERS.ARGS || key === IDL_DOCS_HEADERS.KEYWORDS) &&
        !after &&
        i < comments.length - 2
      ) {
        /** Get text on the next line instead */
        const nextLine = comments[i + 1].match[0].replace(
          REMOVE_COMMENT_REGEX,
          ''
        );

        // check the next line for parameter information
        if (LEGACY_PARAMETER_NAME_SPLIT.test(nextLine)) {
          comments[i].match[0] = comments[i].match[0] + nextLine;
          lineOffset++;
          toRemove.push(i + 1);
          i++;
          continue;
        }
      }
    }
  }

  // reverse the array
  toRemove = toRemove.reverse();

  // remove all entities
  for (let i = 0; i < toRemove.length; i++) {
    comments.splice(toRemove[i], 1);
  }
}
