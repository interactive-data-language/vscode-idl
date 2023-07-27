import { basename } from 'path';

import { DOCS_URL } from './website-url.interface';

/**
 * Takes a link from the local docs and makes a URL that opens our hosted docs
 * site
 */
export function HostedDocsURLFromLocal(link: string) {
  return `${DOCS_URL}/${encodeURI(
    basename(decodeURI(link)).replace(/\.htm(?!l)/gim, '.html')
  )}`;
}
