import { join } from 'path';

import { DOCS_BASE } from '../docs-exporter.interface';

/**
 * Gets the fully-qualified path for a docs file
 * that we will write to disk
 */
export function GetDocsFilepath(exportDir: string, relative: string) {
  return join(exportDir, relative.substring(DOCS_BASE.length));
}
