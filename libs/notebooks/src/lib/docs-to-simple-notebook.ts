import { EncodeNotebook } from './encode-notebook';
import { EncodeNotebookCellContent } from './encode-notebook-cell-content';
import { RawNotebook } from './raw-notebook.interface';

/**
 * Convert docs to a simple notebook file
 */
export function DocsToSimpleNotebook(docs: string | string[]) {
  const useDocs = Array.isArray(docs) ? docs : [docs];

  /**
   * Create raw notebook
   */
  const raw: RawNotebook = {
    version: '1.0.0',
    cells: useDocs.map((item) => {
      return {
        type: 'markdown',
        content: EncodeNotebookCellContent(item),
      };
    }),
  };

  // return encoded
  return EncodeNotebook(raw);
}
