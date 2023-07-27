import { IRetrieveDocsPayload } from '@idl/vscode/events/messages';

import { EncodeNotebook } from './encode-notebook';
import { EncodeNotebookCellContent } from './encode-notebook-cell-content';
import { RawNotebook, RawNotebookCell } from './raw-notebook.interface';

const START_CODE = /^\s*```idl/i;

const END_CODE = /^\s*```/i;

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

  // track the last content
  const lastContent: string[] = [];
  const lastCode: string[] = [];
  let isOpen = false;
  let first = true;

  // process each line
  for (let i = 0; i < split.length; i++) {
    // if first line, strip out the notebook link
    if (i === 0) {
      continue;
    }

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
      case line.startsWith('#'):
        if (lastContent.length > 0) {
          (cells.length === 1 ? cells : docsCells).push({
            type: 'markdown',
            content: EncodeNotebookCellContent(lastContent.join('\n')),
          });
          lastContent.splice(0, lastContent.length);
        }
        docsCells.push({
          type: 'markdown',
          content: EncodeNotebookCellContent(line),
        });
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
  if (lastContent.length > 0) {
    docsCells.push({
      type: 'markdown',
      content: EncodeNotebookCellContent(lastContent.join('\n')),
    });
    lastContent.splice(0, lastContent.length);
  }

  // check if we have example cells to add in
  if (exampleCells.length > 0) {
    cells.push({
      type: 'markdown',
      content: EncodeNotebookCellContent(`#### Examples`),
    });
    cells = cells.concat(exampleCells);
  }

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
