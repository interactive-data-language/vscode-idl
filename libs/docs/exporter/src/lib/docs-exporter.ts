import { IDLIndex } from '@idl/parsing/index';
import { GlobalTokenType } from '@idl/types/core';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { DefaultTheme } from 'vitepress';

import { GLOBAL_TYPE_PATHS } from './folder-map.interface';
import { WriteFile } from './write-file';

/**
 * Exports docs fro a given folder from our application
 */
export async function IDLDocsExporter(
  index: IDLIndex,
  outDir: string,
  globs: string[] = []
): Promise<void> {
  /**
   * Get the things we need to export
   */
  const toExport = index.globalIndex.export(globs);

  /**
   * Get the types of global tokens that we need to export
   */
  const exportTypes = Object.keys(toExport) as GlobalTokenType[];

  /**
   * Get folder we export to
   */
  const exportDir = join(outDir, 'api');

  // make sure the output folder exists if it doesnt
  if (!existsSync(exportDir)) {
    mkdirSync(exportDir, { recursive: true });
  }

  /**
   * Process each type we export
   */
  for (let i = 0; i < exportTypes.length; i++) {
    /**
     * Get tokens for type that we need to export
     */
    const forType = toExport[exportTypes[i]];

    /** Create sidebar for our items */
    const sidebar: DefaultTheme.NavItemWithLink[] = [];

    // process each item
    for (let j = 0; j < forType.length; j++) {
      /** Get item we save */
      const item = forType[j];

      /** Make relative link */
      const relative = `/${GLOBAL_TYPE_PATHS[exportTypes[i]]}/${item.name
        .toLowerCase()
        .replace(/:/g, '_')}.md`;

      /** Specify the folder */
      const outUri = join(exportDir, relative);

      WriteFile(outUri, `# ${item.meta.display}\n\n${item.meta.docs}`);

      // add sidebar entry
      sidebar.push({
        text: item.meta.display,
        link: relative,
      });
    }
  }
}
