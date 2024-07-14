import { IDL_COMMANDS, MatchGlobal } from '@idl/shared';
import { PRODUCT_DOCS_IMAGES } from '@idl/types/websites';
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
  // check if we have a folder for IDL so we can pull images locally
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
              newLink = `${PRODUCT_DOCS_IMAGES}/${basename(back)}`;
            }
          } else {
            newLink = `${PRODUCT_DOCS_IMAGES}/${basename(back)}`;
          }

          // reset value
          newUrl = `[${front}](${newLink})`;
        }
        break;
      // docs that we need to resolve
      case back.startsWith('IDL_DOCS'):
        {
          // set that we resolve the link from the VSCode from-end and open there
          newUrl = `[${front}](command:${
            IDL_COMMANDS.DOCS.OPEN_LINK
          }?${encodeURI(JSON.stringify({ link: back }))})`;
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
