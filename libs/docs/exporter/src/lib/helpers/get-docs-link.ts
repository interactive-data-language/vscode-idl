import { GlobalIndexedToken } from '@idl/parsing/index';

import { DOCS_BASE } from '../docs-exporter.interface';
import { GLOBAL_TYPE_PATHS } from '../folder-map.interface';

/**
 * Get link for docs item
 */
export function GetDocsLink(item: GlobalIndexedToken) {
  return `${DOCS_BASE}/${GLOBAL_TYPE_PATHS[item.type]}/${item.name
    .toLowerCase()
    .replace(/:/g, '_')}.md`.replace(/\\/g, '/');
}
