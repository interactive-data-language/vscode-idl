import { Assembler } from '@idl/assembler';
import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IDLNotebookDocument } from '@idl/notebooks/shared';
import {
  DEFAULT_NOTEBOOK_TO_PRO_CODE_OPTIONS,
  INotebookToProCodeOptions,
} from '@idl/notebooks/types';
import { IDLIndex } from '@idl/parsing/index';
import { SyntaxTree, TreeToken } from '@idl/parsing/syntax-tree';
import { MainLevelToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Converts a notebook to PRO code on disk
 */
export async function NotebookToProCode(
  index: IDLIndex,
  file: string,
  notebook: IDLNotebookDocument,
  formatting: IAssemblerOptions<FormatterType>,
  cancel: CancellationToken,
  options: Partial<INotebookToProCodeOptions> = {}
): Promise<string> {
  /**
   * Merge options for notebook creation
   */
  const useOptions = { ...DEFAULT_NOTEBOOK_TO_PRO_CODE_OPTIONS, ...options };

  /**
   * Index our file
   */
  const indexed = await index.getParsedNotebook(file, notebook, cancel);

  /**
   * Routine code (non-main)
   */
  let routines: string[] = [];

  /**
   * Main level program code
   */
  let main: string[] = [];

  // track our strings
  for (let i = 0; i < notebook.cells.length; i++) {
    /**
     * Get for cell
     */
    const key = `${file}#${i}`;

    /** Get parsed cell */
    const parsed = indexed[key];

    // if cell is undefined, it isnt code
    if (parsed === undefined) {
      // check if we keep everything or not
      if (useOptions.includeAllCells) {
        if (routines.length > 0) {
          routines.push('');
        }

        // get the cell
        const mdCell = notebook.cells[i];

        // add in markdown or other cells
        routines = routines.concat(
          mdCell.text.split(/\r?\n/gim).map((line) => `; ${line}`)
        );
      }

      continue;
    }

    // save a reference to the tree
    const tree = parsed.tree;

    // skip if nothing
    if (parsed.tree.length === 0) {
      continue;
    }

    /** Non-main tokens */
    let nonMainTokens: SyntaxTree = [];

    /** Main level tokens */
    let mainTokens: SyntaxTree = [];

    // see how we need to split
    if (tree[tree.length - 1].name === TOKEN_NAMES.MAIN_LEVEL) {
      // check if we have something besides main
      if (tree.length > 1) {
        nonMainTokens = tree.slice(0, tree.length - 1);
      }

      // save main tokens
      mainTokens = (tree[tree.length - 1] as TreeToken<MainLevelToken>).kids;
    } else {
      nonMainTokens = tree;
    }

    // check for non-main
    if (nonMainTokens.length > 0) {
      // get the syntax tree
      parsed.tree = nonMainTokens;

      // format the main level program
      const nonMain = Assembler(parsed, cancel, {
        ...formatting,
        autoDoc: false,
        styleAndFormat: false,
      });

      // TODO: figure out what to do if syntax error
      if (nonMain === undefined) {
        return;
      }

      // add extra line
      if (routines.length > 0) {
        routines.push('');
      }

      // combine
      routines = routines.concat(nonMain.split(/\r?\n/g));
    }

    // check for main
    if (mainTokens.length > 0) {
      // get the syntax tree
      parsed.tree = mainTokens;

      // format the main level program
      const formattedMain = Assembler(parsed, cancel, formatting);

      // TODO: figure out what to do if syntax error
      if (formattedMain === undefined) {
        return;
      }

      // add extra line
      if (main.length > 0) {
        main.push('');
      }

      // combine
      main = main.concat(formattedMain.split(/\r?\n/g));
    }
  }

  /**
   * Strings we save to disk
   */
  let strings: string[] = [];

  // combine routine strings
  if (routines.length > 0) {
    strings = strings.concat(routines);
  }

  // combine main strings
  if (main.length > 0) {
    if (strings.length > 0) {
      strings.push('');
    }

    // add header to the start of the main level program
    main.unshift('');
    main.unshift('compile_opt idl2');
    main.unshift('; main level program');

    // close the main level program
    main.push('end');

    // merge strings
    strings = strings.concat(main);
  }

  return strings.join(formatting.eol === 'lf' ? '\n' : '\r\n');
}
