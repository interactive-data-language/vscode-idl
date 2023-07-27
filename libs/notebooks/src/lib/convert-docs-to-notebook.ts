import { IRetrieveDocsPayload } from '@idl/vscode/events/messages';

import { EncodeNotebook } from './encode-notebook';
import { EncodeNotebookCellContent } from './encode-notebook-cell-content';
import { RawNotebook, RawNotebookCell } from './raw-notebook.interface';

/**
 * When does code block start
 */
const START_CODE = /^\s*```idl/i;

/**
 * Code blocks end (or basic start)
 */
const END_CODE = /^\s*```/i;

/**
 * Sections we dont save
 */
const DONT_SAVE_SECTION = /^#+\s*(?:Argument|Keyword|Example)/i;

/**
 * Converts docs to a nice looking notebook
 */
export function ConvertDocsToNotebook(
  info: IRetrieveDocsPayload,
  docs: string
) {
  /** Notebook cells */
  let cells: RawNotebookCell[] = [];
  const exampleCells: RawNotebookCell[] = [];
  const docsCells: RawNotebookCell[] = [];

  cells.push({
    type: 'markdown',
    content: EncodeNotebookCellContent(`#### ${info.name}`),
  });

  // split on new lines
  const split = docs.split('\n');

  /** last text content for markdown */
  const lastContent: string[] = [];

  /** last code from code block */
  const lastCode: string[] = [];

  /** track if code block is open */
  let isOpen = false;

  /** Check if first code block (indicates syntax example) */
  let first = true;

  /** track if we save our current block */
  let saveBlock = true;

  // process each line
  for (let i = 0; i < split.length; i++) {
    /** Get the current line */
    const line = split[i];

    switch (true) {
      /**
       * Start of IDL code block
       */
      case START_CODE.test(line):
        isOpen = true;
        lastContent.push(line);
        break;

      /**
       * End of a code block
       */
      case END_CODE.test(line):
        // check if we have an open IDL code block
        if (isOpen && lastCode.length > 0) {
          if (!first) {
            if (!lastCode[0].startsWith('   ')) {
              exampleCells.push({
                type: 'code',
                content: EncodeNotebookCellContent(
                  lastCode.map((codeLine) => codeLine.substring(2)).join('\n')
                ),
              });
            }
          }
          first = false;
          lastCode.splice(0, lastContent.length);
          isOpen = false;
        }
        lastContent.push(line);
        break;

      // check if new section
      case line.startsWith('#'):
        // do we have content to save?
        if (lastContent.length > 0) {
          // are we saving this block?
          if (saveBlock) {
            (cells.length === 1 ? cells : docsCells).push({
              type: 'markdown',
              content: EncodeNotebookCellContent(lastContent.join('\n')),
            });
          }

          // clear content
          lastContent.splice(0, lastContent.length);
        }

        // check if we save our section or not
        saveBlock = !DONT_SAVE_SECTION.test(line);

        // check if we save
        if (saveBlock) {
          docsCells.push({
            type: 'markdown',
            content: EncodeNotebookCellContent(line),
          });
        }

        break;

      default:
        if (isOpen) {
          lastCode.push(line);
        }
        lastContent.push(line);
        break;
    }
  }

  // check if we have a cell to close
  if (lastContent.length > 0 && saveBlock) {
    docsCells.push({
      type: 'markdown',
      content: EncodeNotebookCellContent(lastContent.join('\n')),
    });
  }

  // empty
  lastContent.splice(0, lastContent.length);

  // check if we have example cells to add in
  if (exampleCells.length > 0) {
    cells.push({
      type: 'markdown',
      content: EncodeNotebookCellContent(`#### Examples`),
    });
    cells = cells.concat(exampleCells);
  }

  // add in docs cells
  cells = cells.concat(docsCells);

  /**
   * Create raw notebook
   */
  const raw: RawNotebook = {
    version: '1.0.0',
    cells,
  };

  // return encoded
  return EncodeNotebook(raw);
}
