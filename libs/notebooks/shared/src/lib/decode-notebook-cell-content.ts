/**
 * Decodes contents of notebook input cells
 */
export function DecodeNotebookCellContent(content: string) {
  return Buffer.from(content, 'base64').toString();
}
