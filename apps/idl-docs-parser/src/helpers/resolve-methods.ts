import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';
import { GlobalDisplayNameLookup, IGlobalFromIDL } from '@idl/parsing/routines';
import { MatchGlobal } from '@idl/shared';

import { IDL_DIR } from '../idl-dir.interface';
import { IDocsByRoutine } from '../main.interface';
import { ClassDisplayName, MethodDisplayName } from './display-names';
import { ParseDocsHTML } from './docs-parser';
import { HTMLToMarkdown } from './html-to-markdown';
import { IParsedHTML } from './parser.interface';
import { LINK_REGEX } from './replace-links';
import { UnescapeMarkdown } from './unescape-markdown';

/**
 * Additional methods that we need to resolve
 */
export const RESOLVED_METHODS: IGlobalFromIDL[] = [];

/**
 * uses the "Methods" section of docs to fully resolve any other
 * methods for internal routines that should be captured.
 *
 * This is because not everything is located in the docs catalog files
 * and requires some extra checked.
 *
 * The additional arguments help support recursion so that we can not
 * try to resolve something that we are already going to resolve
 */
export async function ResolveMethods(
  allDocs: IDocsByRoutine,
  className: string,
  methodHTML: IParsedHTML[],
  dir: string,
  lookup: GlobalDisplayNameLookup
) {
  // get the class name we use
  const useClass = className.toLowerCase();

  // skip tasks and rasters which have inheritance and *should* cover most cases
  if (
    useClass.endsWith(' task') ||
    (useClass.endsWith('raster') && useClass !== 'enviraster') ||
    useClass.endsWith('pointcloud')
  ) {
    return;
  }

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

  // process all of our matches
  for (let i = 0; i < toProcess.length; i++) {
    // extract parts of our link
    // [front(back)
    const methodName = UnescapeMarkdown(
      toProcess[i][0].includes('::')
        ? toProcess[i][0].split('::')[1]
        : toProcess[i][0]
    );
    const useMethod = methodName.toLowerCase();
    const docsLink = toProcess[i][1];

    // skip init methods
    if (useMethod === 'init') {
      continue;
    }
    if (docsLink.startsWith('IDL_DOCS') && !docsLink.includes('#')) {
      // skip
      const docsUri = decodeURI(
        docsLink.replace('IDL_DOCS/..', `${IDL_DIR}/help/online_help`)
      );

      /** Class and method name */
      const wholeName = `${useClass}::${methodName.toLowerCase()}`;

      // console.log(`${useClass}::${methodName.toLowerCase()}`);

      /** Parse the HTML for our method */
      const parsedFile = await ParseDocsHTML(docsUri);

      /** Get the method/routine names present in the file */
      const methods = Object.keys(parsedFile);

      // make sure we found routines
      if (methods.length > 0) {
        // verify that there is a method name
        if (
          methods[0].includes(`::${useMethod}`) ||
          methods[0].startsWith(useMethod)
        ) {
          /** Stuff we parsed for our potential matching method */
          const parsed = parsedFile[methods[0]];

          /** Get key-value pair docs  */
          const docs = parsed.docs;

          // check if we have syntax example to get out type
          if ('Syntax' in docs) {
            const syntax = HTMLToMarkdown(docs['Syntax'], dir);

            // eslint-disable-next-line no-useless-escape
            const isFunction = new RegExp(
              `\\b_?${useMethod}_?\\s*\\(`,
              'im'
            ).test(syntax);

            /**
             * Lookup of global routines to compare against
             */
            const compareLookup =
              lookup[
                isFunction
                  ? GLOBAL_TOKEN_TYPES.FUNCTION_METHOD
                  : GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD
              ];

            if (!(wholeName in compareLookup)) {
              compareLookup[wholeName] = `${useClass}::${methodName}`;

              // save
              RESOLVED_METHODS.push({
                type: isFunction
                  ? GLOBAL_TOKEN_TYPES.FUNCTION_METHOD
                  : GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
                name: MethodDisplayName(
                  `${ClassDisplayName(className)}::${methodName}`
                ),
                source: 'internal',
                link: docsUri.replace(
                  `${IDL_DIR}/help/online_help/Subsystems`,
                  ''
                ),
              });
            }
          }
        }
      }
    }
  }
}
