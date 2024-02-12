import { PRODUCT_DOCS_WEBSITE } from '@idl/types/websites';
import { basename } from 'path';

/**
 * Takes a link from the local docs and makes a URL that opens our hosted docs
 * site
 */
export function ResolveProductDocsURL(link: string) {
  return `${PRODUCT_DOCS_WEBSITE}/${encodeURI(
    basename(decodeURI(link)).replace(/\.htm(?!l)/gim, '.html')
  )}`;
}
