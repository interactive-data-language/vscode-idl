import { MatchGlobal } from '@idl/shared';

import { IDL_DIR } from '../idl-dir.interface';
import { IRoutineDocs } from '../main.interface';
import { ParseDocsHTML } from './docs-parser';
import { HTMLToMarkdown } from './html-to-markdown';
import { IParsedHTML } from './parser.interface';
import { ProcessParameters } from './process-parameters';
import { LINK_REGEX } from './replace-links';
import { UnescapeMarkdown } from './unescape-markdown';

/**
 * Resolves properties when those properties come from other files
 */
export async function ResolveProperties(
  routineDocs: IRoutineDocs,
  methodHTML: IParsedHTML[],
  dir: string
) {
  // track the links to process
  const toProcess: [string, string][] = [];

  // convert to string
  const strung = HTMLToMarkdown(methodHTML, dir);

  /** Current matches */
  let match: RegExpExecArray | null = MatchGlobal(strung, LINK_REGEX, true);

  // recursively process our strings
  while (match !== null) {
    toProcess.push([match[1], match[2]]);

    // check the next match
    match = MatchGlobal(strung, LINK_REGEX);
  }

  // track the processed files to make sure we don't process the same thing multiple times
  const alreadyDone: { [key: string]: any } = {};

  // process all of our matches
  for (let i = 0; i < toProcess.length; i++) {
    // extract parts of our link
    // [front(back)
    const className = UnescapeMarkdown(
      toProcess[i][0].includes('::')
        ? toProcess[i][0].split('::')[1]
        : toProcess[i][0]
    ).toLowerCase();
    const docsLink = toProcess[i][1];

    // make sure it is another file
    if (docsLink.startsWith('IDL_DOCS')) {
      // skip
      const docsUri = decodeURI(
        docsLink
          .split('#')[0]
          .replace('IDL_DOCS/..', `${IDL_DIR}/help/online_help`)
      );

      // skip if we already processed this file
      if (docsUri in alreadyDone) {
        continue;
      }

      /** Parse the HTML for our method */
      const parsedFile = await ParseDocsHTML(docsUri);

      // set flag that we are done with this file
      alreadyDone[docsUri] = true;

      // check for our class in the file
      if (className in parsedFile) {
        const helper = parsedFile[className];
        routineDocs.properties = {
          ...(await ProcessParameters(helper.properties, docsUri)),
          ...routineDocs.properties,
        };
      }
    }
  }
}
