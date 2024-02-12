import { DOCS_BASE } from '../docs-exporter.interface';
import { DOCS_PATHS } from '../folder-map.interface';

/**
 * Gets the link for a class
 */
export function GetClassLink(name: string) {
  return `${DOCS_BASE}/${DOCS_PATHS.CLASS}/${name}.md`;
}
