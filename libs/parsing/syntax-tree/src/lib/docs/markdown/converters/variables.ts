import { IDocs } from '../../extract-docs.interface';

/**
 * Specify docs tags that we should keep - only one not included is the
 * general tag which is manually processed below
 */
const KEEP_THESE: { [key: string]: boolean } = {};

/**
 * Converts variable information to markdown
 */
export function VariablesToMarkdown(info: IDocs): string {
  // get our header keys
  const keys = Object.keys(info);

  // process each additional key
  for (let i = 0; i < keys.length; i++) {
    if (!(keys[i] in KEEP_THESE)) {
      continue;
    }
  }

  return '';
}
