import { GlobalDisplayNameLookup } from '@idl/parsing/routines';
import { basename, dirname } from 'path';

import { IDL_DIR } from '../idl-dir.interface';
import {
  IDocsByRoutine,
  IHTMLByRoutine,
  IRoutineDocs,
} from '../main.interface';
import { HTMLToMarkdown } from './html-to-markdown';
import { ProcessParameters } from './process-parameters';
import { ResolveMethods } from './resolve-methods';
import { ResolveProperties } from './resolve-properties';
import { ResolveSuperclasses } from './resolve-superclasses';

const SKIP_SECTIONS = {
  'Version History': true,
  'API Version': true,
  'API&#160;Version': true,
  'See Also': true,
  Methods: true,
  Properties: true,
  Superclasses: true,
  Syntax: true, // will make on our own
};

/**
 * Converts parsed HTML back to documentation
 */
export async function HTMLToDocs(
  html: IHTMLByRoutine,
  file: string,
  lookup: GlobalDisplayNameLookup
): Promise<IDocsByRoutine> {
  // get the directory for our file
  const dir = dirname(file);

  // initialize output
  const allDocs: IDocsByRoutine = {};

  // get keys
  const keys = Object.keys(html);

  // process everything we extracted
  for (let i = 0; i < keys.length; i++) {
    // extract routine
    const routine = html[keys[i]];

    // initialize output
    const routineDocs: IRoutineDocs = {
      name: routine.name,
      link: `${dir
        .replace(`${IDL_DIR}\\help\\online_help`, 'IDL_DOCS/..')
        .replace(/\\/g, '/')}/${encodeURI(basename(file))}`,
      docs: {},
      args: {},
      keywords: {},
      properties: {},
    };

    // process our docs
    const sections = Object.keys(routine.docs);
    for (let j = 0; j < sections.length; j++) {
      if (sections[j] in SKIP_SECTIONS) {
        switch (sections[j]) {
          case 'Methods':
            await ResolveMethods(
              allDocs,
              routine.name,
              routine.docs[sections[j]],
              dir,
              lookup
            );
            break;
          case 'Properties':
            await ResolveProperties(
              routineDocs,
              routine.docs[sections[j]],
              dir
            );
            break;
          case 'Superclasses':
            ResolveSuperclasses(routine.name, routine.docs[sections[j]], dir);
            break;
          default:
            break;
        }
        continue;
      }
      routineDocs.docs[sections[j]] = HTMLToMarkdown(
        routine.docs[sections[j]],
        dir
      );
    }

    // process our parameters
    routineDocs.args = await await ProcessParameters(routine.args, file);
    routineDocs.keywords = await await ProcessParameters(
      routine.keywords,
      file
    );
    routineDocs.properties = {
      ...routineDocs.properties,
      ...(await await ProcessParameters(routine.properties, file)),
    };

    // save output
    allDocs[keys[i]] = routineDocs;
  }

  return allDocs;
}
