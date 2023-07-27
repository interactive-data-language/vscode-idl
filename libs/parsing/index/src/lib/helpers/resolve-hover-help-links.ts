import {
  DOCS_IMAGES_URL,
  HostedDocsURLFromLocal,
  MatchGlobal,
} from '@idl/shared';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { existsSync } from 'fs';
import { basename, dirname } from 'path';
import { pathToFileURL } from 'url';

/**
 * Extract links from markdown so that we can sanitize them
 */
const LINK_REGEX = /\[(.*?)\]\((.*?)\)/gim;

/**
 * Resolves links for images and documentation based on our current configuration.
 *
 * Uses the local  images if they exists and uses online help if they dont.
 *
 * Also controls what links are shown in the hover help to users (i.e. local or hosted).
 */
export function ResolveHoverHelpLinks(
  help: string,
  config: IDLExtensionConfig,
  isNotebook = false
) {
  // check if we have a folder for IDL
  const localHelp =
    config.IDL.directory !== '' && existsSync(config.IDL.directory);

  // get the base IDL install folder folder (i.e. C:\Program Files\Harris\ENVI56\IDL88)
  const idlBase = dirname(dirname(config.IDL.directory));

  /** Current matches */
  let match: RegExpExecArray | null = MatchGlobal(help, LINK_REGEX, true);

  /** Front of the match */
  let front = '';

  /** Link for the match */
  let back = '';

  /** Link to replace with, we only replace if it has a value */
  let newUrl = '';

  /** Location of our regex parser */
  let currentPos = 0;

  // recursively process our strings
  while (match !== null) {
    // extract parts of our link
    // [front(back)
    front = match[1];
    back = match[2];

    // reset URL
    newUrl = '';

    // get current position
    currentPos = match.index;

    // determine how to proceed
    switch (true) {
      // image that we need to resolve
      case back.startsWith('IDL_DIR'):
        {
          // initialize the value for our link
          let newLink = '';

          // check if we have IDL installed and configured
          if (localHelp) {
            // get the fully-qualified filepath
            const uri = back.replace('IDL_DIR', idlBase);

            // make sure it exists, otherwise default to the web-hosted
            // could be that we dont have the content installed we are trying
            // to reference
            if (existsSync(uri) && !isNotebook) {
              newLink = pathToFileURL(uri).toString();
            } else {
              newLink = `${DOCS_IMAGES_URL}/${basename(back)}`;
            }
          } else {
            newLink = `${DOCS_IMAGES_URL}/${basename(back)}`;
          }

          // reset value
          newUrl = `[${front}](${newLink})`;
        }
        break;
      // docs that we need to resolve
      case back.startsWith('IDL_DOCS'):
        {
          // initialize the value for our link
          let newLink = '';

          //
          // vscode does not properly honor file links so we need to use our default logic
          //
          // // check if we have IDL installed and configured
          // if (localHelp) {
          //   // get the relative filepath without our placeholder
          //   const relative = dirname(back).replace('IDL_DOCS/../', '');

          //   // get the fully-qualified docs folder
          //   const localFolder = `${idlBase}/help/online_help/${relative}`;

          //   // get actual URL within the file - this is not encoded when built
          //   // in apps\idl-docs-parser\src\helpers\replace-links.ts
          //   const localFile = decodeURI(basename(back.split('#')[0]));

          //   // get our URI
          //   const uri = `${localFolder}/${localFile}`;

          //   // make sure it exists, otherwise default to the web-hosted
          //   // could be that we dont have the content installed we are trying
          //   // to reference
          //   if (existsSync(uri)) {
          //     newLink =
          //       pathToFileURL(`${idlBase}/help/online_help`).toString() +
          //       `/help.htm#../${encodeURI(relative)}/${basename(back)}`;
          //   } else {
          //     newLink = HostedDocsURLFromLocal(back);
          //   }
          // } else {
          //   newLink = HostedDocsURLFromLocal(back);
          // }

          newLink = HostedDocsURLFromLocal(back);

          // reset value
          newUrl = `[${front}](${newLink})`;
        }
        break;
      default:
        break;
    }

    // replace string if we have something
    if (newUrl !== '') {
      help =
        help.substring(0, currentPos) +
        newUrl +
        help.substring(currentPos + match[0].length);

      // move to the end of our text to continue searching
      LINK_REGEX.lastIndex = currentPos + newUrl.length;
    }

    // check the next match
    match = MatchGlobal(help, LINK_REGEX);
  }

  return help;
}
