import { MatchGlobal } from '@idl/shared';
import { existsSync } from 'fs';
import { basename, dirname } from 'path';

import { IDL_DIR } from '../idl-dir.interface';
import { ResolveLinks } from './resovle-links';

/**
 * Extract links from markdown so that we can sanitize them
 */
export const LINK_REGEX = /\[(.*?)\]\((.*?)\)/gim;

/**
 * Links at the start of the line
 */
export const LINK_LINE_START = /^\[(.*?)\]\((.*?)\)/gim;

/** If this is present in the link, remove it */
const LINK_CHECK = '.htm';

/**
 * Regex to test for image links
 */
const IMAGE_REGEX = /\.(png|jpeg|jpg|tif|tiff|gif)/i;

/**
 * Replace internal links in the HTML converted to markdown.
 *
 * This converts links like "[ROIMaskRaster](ENVIROIMaskRasterTask.htm)"
 * to "ROIMaskRaster" and removes the actual link because we are not
 * a standardized help system like that.
 *
 * TODO: We could maybe try to have file URLs or links to our online docs
 * instead.
 */
export function ReplaceLinks(mdStrings: string, folder: string) {
  /** Current matches */
  let match: RegExpExecArray | null = MatchGlobal(mdStrings, LINK_REGEX, true);

  /** Front of the match */
  let front = '';

  /** Link for the match */
  let back = '';

  /** Link to replace with, we only replace if it has a value */
  let newLink = '';

  /** Location of our regex parser */
  let currentPos = 0;

  // recursively process our strings
  while (match !== null) {
    // extract parts of our link
    // [front(back)
    front = match[1];
    back = match[2];

    // reset value
    newLink = '';

    // get current position
    currentPos = match.index;

    // determine how to process our link
    switch (true) {
      // image URL that we need to process so we can get relative paths on-the-fly
      case IMAGE_REGEX.test(match[0]): {
        // attempt to get the fully-qualified filepath
        const imFile = ResolveLinks(folder, back);
        if (existsSync(imFile)) {
          // get a new link to our hosted docs
          newLink = `[${front}](${imFile
            .replace(IDL_DIR, 'IDL_DIR')
            .replace(/\\/g, '/')})`;
        } else {
          console.log('');
          console.log('Missing image link');
          console.log(`  Folder : ${folder}`);
          console.log(`  Link   : ${back}`);
          console.log(`  Image  : ${imFile}`);
          console.log('');
        }
        break;
      }
      // do nothing with relative links
      case back.startsWith('#'):
        {
          newLink = front;
        }
        break;
      case back.includes(LINK_CHECK) && !back.startsWith('http'):
        {
          // get the file name
          const file = decodeURI(back.split('#')[0]);

          // attempt to get the fully-qualified filepath
          const imFile = ResolveLinks(folder, file);

          // make sure the file exists
          if (existsSync(imFile)) {
            // get the folder path for local docs, can translate to online
            // help at click-time
            const dir = `${dirname(imFile)
              .replace(`${IDL_DIR}\\help\\online_help`, 'IDL_DOCS/..')
              .replace(/\\/g, '/')}`;

            // get a new link to our hosted docs
            newLink = `[${front}](${decodeURI(dir)}/${basename(back)})`;
          } else {
            console.log('');
            console.log('Missing HTML file');
            console.log(`  Folder : ${folder}`);
            console.log(`  Link   : ${back}`);
            console.log(`  Image  : ${imFile}`);
            console.log('');

            // // default logic
            // newLink = `[${front}](${HostedDocsURL(back)})`;
          }
        }
        break;
      default:
        break;
    }

    // replace if we have a link
    if (newLink !== '') {
      // replace string
      mdStrings =
        mdStrings.substring(0, currentPos) +
        newLink +
        mdStrings.substring(currentPos + match[0].length);

      // move to the end of our text to continue searching
      LINK_REGEX.lastIndex = currentPos + newLink.length + 1;
    }

    // check the next match
    match = MatchGlobal(mdStrings, LINK_REGEX);
  }

  return mdStrings;
}
