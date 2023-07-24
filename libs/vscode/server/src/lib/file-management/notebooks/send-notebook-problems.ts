import { NotebookDocument } from 'vscode-languageserver';

import { SendProblems } from '../../helpers/send-problems';

/**
 * Sends problems that have been detected in notebook cells
 */
export function SendNotebookProblems(notebook: NotebookDocument) {
  SendProblems(
    [notebook.uri].concat(notebook.cells.map((cell) => cell.document))
  );
}
