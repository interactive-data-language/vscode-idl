/**
 * Encodes contents of notebook input cells
 */
export function EncodeNotebookCellContent(content: string) {
  return Buffer.from(content).toString('base64');
}
