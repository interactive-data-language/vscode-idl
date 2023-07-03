import { MatchGlobal } from '@idl/shared';

import { INHERITANCE_OVERRIDE } from '../overrides/detail/inheritance-override.interface';
import { SmartMerge } from '../type-guess/inheritance-guess';
import { HTMLToMarkdown } from './html-to-markdown';
import { IParsedHTML } from './parser.interface';
import { LINK_REGEX } from './replace-links';
import { UnescapeMarkdown } from './unescape-markdown';

/**
 * Resolves inheritance
 */
export function ResolveSuperclasses(
  className: string,
  superHTML: IParsedHTML[],
  dir: string
) {
  // get the class name that we use
  const useClass = className.toLowerCase();

  // skip tasks and rasters which have inheritance and *should* cover most cases
  if (
    useClass.endsWith('task') ||
    useClass.endsWith('raster') ||
    useClass.endsWith('pointcloud')
  ) {
    return;
  }

  // track the links to process
  const inheritance: string[] = [];

  // convert to string
  const strung = HTMLToMarkdown(superHTML, dir);

  /** Current matches */
  let match: RegExpExecArray | null = MatchGlobal(strung, LINK_REGEX, true);

  // recursively process our strings
  while (match !== null) {
    if (
      match[2].startsWith('IDL_DOCS') &&
      !match[1].includes('::') &&
      !match[1].includes(' ')
    ) {
      inheritance.push(UnescapeMarkdown(match[1]).toLowerCase());
    }
    // check the next match
    match = MatchGlobal(strung, LINK_REGEX);
  }

  // check if we have inheritance
  if (inheritance.length > 0) {
    if (!(useClass in INHERITANCE_OVERRIDE)) {
      INHERITANCE_OVERRIDE[useClass] = inheritance;
    } else {
      SmartMerge(INHERITANCE_OVERRIDE[useClass], inheritance);
    }
  }
}
