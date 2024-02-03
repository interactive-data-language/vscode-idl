import { GlobalIndexedToken } from '@idl/parsing/index';

import { GLOBAL_TYPE_PATHS } from './folder-map.interface';

/**
 * Get link for docs item
 */
export function GetDocsLink(item: GlobalIndexedToken) {
  return `/${GLOBAL_TYPE_PATHS[item.type]}/${item.name
    .toLowerCase()
    .replace(/:/g, '_')}.md`.replace(/\\/g, '/');
}
