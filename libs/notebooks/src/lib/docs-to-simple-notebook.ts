import { EncodeNotebook } from './encode-notebook';
import { EncodeNotebookCellContent } from './encode-notebook-cell-content';
import { RawNotebook } from './raw-notebook.interface';

/**
 * Convert docs to a simple notebook file
 */
export function DocsToSimpleNotebook(docs: string) {
  /**
   * Create raw notebook
   */
  const raw: RawNotebook = {
    version: '1.0.0',
    cells: [
      {
        type: 'markdown',
        content: EncodeNotebookCellContent(docs),
      },
    ],
  };

  // return encoded
  return EncodeNotebook(raw);
}
