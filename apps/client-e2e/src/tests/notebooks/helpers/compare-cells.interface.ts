import { IDLRawNotebookCellType } from '@idl/notebooks/shared';

type MimeTypes = 'text/html' | 'text/plain' | 'image/png';

/**
 * Output for cells
 */
export interface ICompareCellOutputs {
  /** Cell we are comparing against */
  idx: number;
  /** did we succeed */
  success: boolean;
  /** All of the cell mimetypes */
  mimeTypes: MimeTypes[];
}

/**
 * Cells and their outputs
 */
export interface ICompareCellAndOutputs {
  /** Cell we are comparing against */
  idx: number;
  /** Type of cell */
  kind: IDLRawNotebookCellType;
  /** All of the cell mimetypes */
  outputs: MimeTypes[];
}
