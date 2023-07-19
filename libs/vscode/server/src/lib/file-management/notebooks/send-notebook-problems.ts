import { IParsedIDLNotebook } from '@idl/notebooks';
import { GetSyntaxProblems } from '@idl/parsing/index';
import { GetFSPath } from '@idl/shared';
import { NotebookDocument } from 'vscode-languageserver';

import { SyntaxProblemsToDiagnostic } from '../../helpers/syntax-problem-to-diagnostic';
import { SERVER_CONNECTION } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';

/**
 * Track last version of notebook document to remove problems if the cell is deleted
 */
const OLD_CELLS: { [key: string]: Set<string> } = {};

/**
 * Sends problems that have been detected in notebook cells
 */
export function SendNotebookProblems(
  notebook: NotebookDocument,
  parsed: IParsedIDLNotebook,
  reset = false
) {
  // check if we are resetting problems
  if (reset) {
    // clean cache
    delete OLD_CELLS[notebook.uri];

    // remove all problems from cells
    for (let i = 0; i < notebook.cells.length; i++) {
      SERVER_CONNECTION.sendDiagnostics({
        uri: notebook.cells[i].document,
        diagnostics: [],
      });
    }

    return;
  }

  /**
   * Get the index of our cells
   */
  const idxs = Object.keys(parsed);

  /**
   * Track current cells
   */
  const theseCells = new Set<string>();

  /**
   * Get FSPath for notebook on disk
   */
  const fsPath = GetFSPath(notebook.uri);

  /**
   * Get global token problems
   */
  const globalProblems = IDL_INDEX.getGlobalTokenSyntaxProblems();

  // process each cell we parsed
  for (let i = 0; i < idxs.length; i++) {
    /** Get index as a number */
    const idx = +idxs[i];

    // track as a celll we have
    theseCells.add(notebook.cells[idx].document);

    /**
     * Get our FS path for the cell
     */
    const cellFsPath = `${fsPath}#${idx}`;

    // sync problems
    SERVER_CONNECTION.sendDiagnostics({
      uri: notebook.cells[idx].document,
      diagnostics: SyntaxProblemsToDiagnostic(
        GetSyntaxProblems(parsed[idx]).concat(
          cellFsPath in globalProblems ? globalProblems[cellFsPath] : []
        )
      ),
    });
  }

  // check if we need to zero problems for any old cells
  if (notebook.uri in OLD_CELLS) {
    /**
     * Get URI's for the old cells
     */
    const oldCells = Array.from(OLD_CELLS[notebook.uri]);

    // process each old cell
    for (let i = 0; i < oldCells.length; i++) {
      // check if missing
      if (!theseCells.has(oldCells[i])) {
        // remove diagnostics
        SERVER_CONNECTION.sendDiagnostics({
          uri: oldCells[i],
          diagnostics: [],
        });
      }
    }
  }

  // save current cell IDs
  OLD_CELLS[notebook.uri] = theseCells;
}
