type MimeTypes = 'text/html' | 'text/plain' | 'image/png';

/**
 * Output for cells
 */
export interface ICompareCells {
  /** Cell we are comparing against */
  idx: number;
  /** did we succeed */
  success: boolean;
  /** Retrieve all of the cell mimetypes */
  mimeTypes: MimeTypes[];
}
