import { IDLIndex } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES, GlobalTokenType } from '@idl/types/core';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { DefaultTheme } from 'vitepress';

import { DOCS_BASE } from './docs-exporter.interface';
import {
  DOCS_PATHS,
  GLOBAL_DOCS_NAMES,
  GLOBAL_TYPE_PATHS,
} from './folder-map.interface';
import { GenerateClassSummaries } from './helpers/create-class-summary';
import { CreateRoutineDocs } from './helpers/create-routine-docs';
import { GetClassLink } from './helpers/get-class-link';
import { GetDisplayName } from './helpers/get-display-name';
import { GetDocsFilepath } from './helpers/get-docs-filepath';
import { GetDocsLink } from './helpers/get-docs-link';
import { WriteFile } from './helpers/write-file';

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

  /** Get names of classes */
  const classNames = Object.keys(classes).sort();

  // create our overall sidebar
  const apiSidebar: any[] = [];

  /** Create classes sidebar */
  let classSideBar: any[] = [];

  /** */
  const classIndex: string[] = [`# All Classes and Structures`, ''];

  /** Write all summaries to disk */
  for (let i = 0; i < classNames.length; i++) {
    const relative = GetClassLink(classNames[i]);
    const uri = GetDocsFilepath(exportDir, relative);

    // update main list
    classIndex.push(`[${classes[classNames[i]].display}](${relative})`);
    classIndex.push('');

    // write to disk
    WriteFile(
      uri,
      `# ${classes[classNames[i]].display}\n\n${classes[classNames[i]].summary}`
    );

    // create sidebar
    if (classes[classNames[i]].sidebar.length > 0) {
      classSideBar.push({
        text: classes[classNames[i]].display,
        link: relative,
        items: classes[classNames[i]].sidebar,
        collapsed: true,
      });
    } else {
      classSideBar.push({
        text: classes[classNames[i]].display,
        link: relative,
      });
    }
  }

  // sort by classes
  classSideBar = classSideBar.sort((a, b) =>
    a.text > b.text ? 1 : b.text > a.text ? -1 : 0
  );

  // add classes if we have them
  if (classSideBar.length > 0) {
    /** Make relative link */
    const relative = `${DOCS_BASE}/${DOCS_PATHS.CLASS}/index.md`;

    /** Specify the folder */
    const outUri = GetDocsFilepath(exportDir, relative);

    // write content
    WriteFile(outUri, classIndex.join('\n'));

    // update sidebar
    apiSidebar.push({
      text: 'Classes and Structures',
      items: classSideBar,
      link: relative,
      collapsed: true,
    });
  }

  // create the sidebar for our routines
  const routineSidebar: any[] = [];

  /**
   * Process each type we export
   */
  for (let i = 0; i < exportTypes.length; i++) {
    /**
     * Dont export structures, they come from class summaries
     */
    if (exportTypes[i] === GLOBAL_TOKEN_TYPES.STRUCTURE) {
      continue;
    }

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
    const indexFile: string[] = [
      `# All ${GLOBAL_DOCS_NAMES[exportTypes[i]]}`,
      '',
    ];

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
      const outUri = GetDocsFilepath(exportDir, relative);

      // write to disk
      WriteFile(outUri, CreateRoutineDocs(item));

      // add sidebar entry
      sidebar.push({
        text: item.meta.display,
        link: relative,
      });
    }

    // write index file if we have it
    if (indexFile.length > initLength) {
      /** Make relative link */
      const relative = `${DOCS_BASE}/${
        GLOBAL_TYPE_PATHS[exportTypes[i]]
      }/index.md`;

      /** Specify the folder */
      const outUri = GetDocsFilepath(exportDir, relative);

      // write content
      WriteFile(outUri, indexFile.join('\n'));

      // save sidebar
      if (
        sidebar.length > 0 &&
        exportTypes[i] !== GLOBAL_TOKEN_TYPES.FUNCTION_METHOD &&
        exportTypes[i] !== GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD
      ) {
        routineSidebar.push({
          text: GLOBAL_DOCS_NAMES[exportTypes[i]],
          items: sidebar,
          link: relative,
          collapsed: true,
        });
      } else {
        routineSidebar.push({
          text: GLOBAL_DOCS_NAMES[exportTypes[i]],
          link: relative,
        });
      }
    }
  }

  if (routineSidebar.length > 0) {
    apiSidebar.push({
      text: 'Routines',
      items: routineSidebar.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      ),
      collapsed: true,
    });
  }

  // export the sidebar
  const sidebarUri = join(outDir, '.vitepress', 'sidebars', 'api.sidebar.json');

  // write sidebar to disk
  WriteFile(
    sidebarUri,
    JSON.stringify(
      apiSidebar.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      ),
      null,
      2
    )
  );
}
