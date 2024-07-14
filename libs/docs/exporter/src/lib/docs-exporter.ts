import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { IDLIndex } from '@idl/parsing/index';
import {
  GetTaskDisplayName,
  GLOBAL_TOKEN_TYPES,
  GlobalTokenType,
  TASK_REGEX,
} from '@idl/types/core';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { DefaultTheme } from 'vitepress';

import { DOCS_BASE } from './docs-exporter.interface';
import {
  DOCS_PATHS,
  GLOBAL_DOCS_NAMES,
  GLOBAL_TYPE_PATHS,
} from './folder-map.interface';
import { CleanDocs } from './helpers/clean-docs';
import { GenerateClassSummaries } from './helpers/create-class-summary';
import { CreateRoutineDocs } from './helpers/create-routine-docs';
import { GetClassLink } from './helpers/get-class-link';
import { GetDisplayName } from './helpers/get-display-name';
import { GetDocsFilepath } from './helpers/get-docs-filepath';
import { GetDocsLink } from './helpers/get-docs-link';
import { WriteFile } from './helpers/write-file';
import { NormalizeCodeBlocks } from './normalizers/normalize-code-blocks';
import { NormalizeItem } from './normalizers/normalize-item';

/**
 * The assembling config for the current workspace we are exporting docs for
 *
 * Which can be used to normalize names
 */
export const CURRENT_CONFIG: IAssemblerOptions<FormatterType> =
  DEFAULT_ASSEMBLER_OPTIONS;

/**
 * Exports docs fro a given folder from our application
 */
export async function IDLDocsExporter(
  index: IDLIndex,
  workspace: string,
  outDir: string,
  globs: string[],
  exclude: string[],
  everything = false
): Promise<void> {
  /**
   * Get the things we need to export
   */
  const toExport = index.globalIndex.export(globs, exclude, everything);

  /**
   * Get the types of global tokens that we need to export
   */
  const exportTypes = Object.keys(toExport) as GlobalTokenType[];

  // normalize all of the items that we export
  for (let i = 0; i < exportTypes.length; i++) {
    const toUpdate = Object.values(toExport[exportTypes[i]]);
    for (let j = 0; j < toUpdate.length; j++) {
      await NormalizeItem(toUpdate[j]);
    }
  }

  /**
   * Get folder we export to
   */
  const exportDir = join(outDir, 'api');

  // update current config
  // CURRENT_CONFIG = index.getConfigForFile(join(workspace, 'foo.md'));

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

  /** ENVITask index */
  const enviTaskIndex: string[] = [`# All ENVI Tasks`, ''];

  /** Create envi task sidebar */
  let enviTaskSideBar: any[] = [];

  /** IDLTask index */
  const idlTaskIndex: string[] = [`# All IDL Tasks`, ''];

  /** Create envi task sidebar */
  let idlTaskSideBar: any[] = [];

  /** Write all summaries to disk */
  for (let i = 0; i < classNames.length; i++) {
    /**
     * Get the display name
     */
    const useDisplay = TASK_REGEX.test(classes[classNames[i]].display)
      ? CleanDocs(GetTaskDisplayName(classes[classNames[i]].display).display)
      : classes[classNames[i]].display;

    /** Default sidebar we append to */
    let updateSidebar = classSideBar;

    /** Default index we update */
    let updateIndex = classIndex;

    // determine where to add our class information
    switch (true) {
      /**
       * ENVI Task
       */
      case useDisplay.toLowerCase().startsWith('envitask'):
        updateIndex = enviTaskIndex;
        updateSidebar = enviTaskSideBar;
        break;

      /**
       * IDL Task
       */
      case useDisplay.toLowerCase().startsWith('idltask'):
        updateIndex = idlTaskIndex;
        updateSidebar = idlTaskSideBar;
        break;
      default:
        break;
    }

    /** Get relative path */
    const relative = GetClassLink(classNames[i]);

    /** Fully qualified filepath */
    const uri = GetDocsFilepath(exportDir, relative);

    // update the index
    updateIndex.push(`[${useDisplay}](${relative})`);
    updateIndex.push('');

    // write to disk
    WriteFile(
      uri,
      await NormalizeCodeBlocks(
        index,
        `---\noutline: deep\n---\n\n# ${useDisplay}\n\n${
          classes[classNames[i]].summary
        }`
      )
    );

    // create sidebar
    if (classes[classNames[i]].sidebar.length > 0) {
      updateSidebar.push({
        text: classes[classNames[i]].display,
        link: relative,
        items: classes[classNames[i]].sidebar,
        collapsed: true,
      });
    } else {
      updateSidebar.push({
        text: classes[classNames[i]].display,
        link: relative,
      });
    }
  }

  // sort by classes
  classSideBar = classSideBar.sort((a, b) =>
    a.text > b.text ? 1 : b.text > a.text ? -1 : 0
  );
  enviTaskSideBar = enviTaskSideBar.sort((a, b) =>
    a.text > b.text ? 1 : b.text > a.text ? -1 : 0
  );
  idlTaskSideBar = idlTaskSideBar.sort((a, b) =>
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

    // update overall sidebar
    apiSidebar.push({
      text: 'Classes and Structures',
      link: relative,
    });
  }

  // add classes if we have them
  if (enviTaskSideBar.length > 0) {
    /** Make relative link */
    const relative = `${DOCS_BASE}/${DOCS_PATHS.ENVI_TASK}/index.md`;

    /** Specify the folder */
    const outUri = GetDocsFilepath(exportDir, relative);

    // write content
    WriteFile(outUri, enviTaskIndex.join('\n'));

    // update overall sidebar
    apiSidebar.push({
      text: 'ENVI Tasks',
      link: relative,
    });
  }

  // add idl tasks if we have them
  if (idlTaskSideBar.length > 0) {
    /** Make relative link */
    const relative = `${DOCS_BASE}/${DOCS_PATHS.IDL_TASK}/index.md`;

    /** Specify the folder */
    const outUri = GetDocsFilepath(exportDir, relative);

    // write content
    WriteFile(outUri, idlTaskIndex.join('\n'));

    // update overall sidebar
    apiSidebar.push({
      text: 'IDL Tasks',
      link: relative,
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

      /** Create our docs */
      const docs = CreateRoutineDocs(item, toExport);

      // write to disk
      WriteFile(outUri, await NormalizeCodeBlocks(index, docs));

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
      // if (
      //   sidebar.length > 0 &&
      //   exportTypes[i] !== GLOBAL_TOKEN_TYPES.FUNCTION_METHOD &&
      //   exportTypes[i] !== GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD
      // ) {
      // routineSidebar.push({
      //   text: GLOBAL_DOCS_NAMES[exportTypes[i]],
      //   items: sidebar,
      //   link: relative,
      //   collapsed: true,
      // });
      apiSidebar.push({
        text: GLOBAL_DOCS_NAMES[exportTypes[i]],
        // items: [
        //   // {
        //   //   text: `List`,
        //   //   link: relative,
        //   // },
        //   {
        //     text: 'By Name',
        //     items: sidebar,
        //     collapsed: true,
        //   },
        // ],
        link: relative,
        // collapsed: true,
      });
      // } else {
      //   apiSidebar.push({
      //     text: GLOBAL_DOCS_NAMES[exportTypes[i]],
      //     link: relative,
      //   });
      // }
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
