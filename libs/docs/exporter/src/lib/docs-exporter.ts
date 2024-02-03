import { IDLIndex } from '@idl/parsing/index';
import { GlobalTokenType } from '@idl/types/core';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { DefaultTheme } from 'vitepress';

import { GenerateClassSummaries } from './create-class-summary';
import { GLOBAL_TYPE_PATHS } from './folder-map.interface';
import { GetDisplayName } from './get-display-name';
import { GetDocsLink } from './get-docs-link';
import { WriteFile } from './write-file';

/**
 * Exports docs fro a given folder from our application
 */
export async function IDLDocsExporter(
  index: IDLIndex,
  outDir: string,
  globs: string[],
  exclude: string[]
): Promise<void> {
  /**
   * Get the things we need to export
   */
  const toExport = index.globalIndex.export(globs, exclude);

  /**
   * Get the types of global tokens that we need to export
   */
  const exportTypes = Object.keys(toExport) as GlobalTokenType[];

  /**
   * Get folder we export to
   */
  const exportDir = join(outDir, 'api');

  /**
   * Delete the folder if it exists
   */
  if (existsSync(exportDir)) {
    rmSync(exportDir, { recursive: true });
  }

  // make sure the output folder exists if it doesnt
  mkdirSync(exportDir, { recursive: true });

  // create summaries of the classes we export
  const classes = GenerateClassSummaries(toExport);

  console.log(classes);

  /**
   * Process each type we export
   */
  for (let i = 0; i < exportTypes.length; i++) {
    /**
     * Get tokens for type that we need to export
     *
     * And sort by name
     */
    const forType = toExport[exportTypes[i]].sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    /** Create sidebar for our items */
    const sidebar: DefaultTheme.NavItemWithLink[] = [];

    /** */
    const indexFile: string[] = ['# Contents', ''];

    /** Get starting length */
    const initLength = indexFile.length;

    // process each item
    for (let j = 0; j < forType.length; j++) {
      /** Get item we save */
      const item = forType[j];

      /**
       * Get display name
       */
      const display = GetDisplayName(item);

      /** Make relative link */
      const relative = GetDocsLink(item);

      // add to index file
      indexFile.push(`[${display}](${relative})`);
      indexFile.push('');

      /** Specify the folder */
      const outUri = join(exportDir, relative);

      // write to disk
      WriteFile(
        outUri,
        `# ${display}\n\n${item.meta.docs.replace(/</g, '\\<')}`
      );

      // add sidebar entry
      sidebar.push({
        text: item.meta.display,
        link: relative,
      });
    }

    // write index file if we have it
    if (indexFile.length > initLength) {
      /** Make relative link */
      const relative = `/${GLOBAL_TYPE_PATHS[exportTypes[i]]}/index.md`;

      /** Specify the folder */
      const outUri = join(exportDir, relative);

      // write content
      WriteFile(outUri, indexFile.join('\n'));
    }
  }
}
