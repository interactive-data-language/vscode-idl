import { IDL_DOCS_HEADERS } from '../../docs.interface';

/**
 * Specify docs tags that we should keep - only one not included is the
 * general tag which is manually processed below
 */
const SKIP_THESE: { [key: string]: boolean } = {};
SKIP_THESE[IDL_DOCS_HEADERS.DEFAULT] = true; // manually process

/**
 * Converts variable information to markdown
 */
export function GeneralToMarkdown(info: { [key: string]: string }): string {
  // initialize strings
  const strings: string[] = [];

  // track overall markdown
  if (IDL_DOCS_HEADERS.DEFAULT in info) {
    strings.push(info[IDL_DOCS_HEADERS.DEFAULT]);
    strings.push('');
  }

  // get our header keys
  const keys = Object.keys(info);

  // process each additional key
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in SKIP_THESE) {
      continue;
    }
    strings.push('');
    strings.push(`#### ${keys[i]}`);
    strings.push(info[keys[i]]);
    strings.push('');
  }

  return strings.join(`\n`);
}
