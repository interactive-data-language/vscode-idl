import { REGEX_IDL_LOCATION, REGEX_STOP_DETECTION } from '@idl/idl';
import { CleanPath, IDLFileHelper, NOTEBOOK_CELL_BASE_NAME } from '@idl/shared';
import { basename } from 'path';

import { IDLNotebookController } from '../idl-notebook-controller.class';

/**
 * Replace paths from syntax errors
 */
function ReplaceSyntaxErrorPaths(
  controller: IDLNotebookController,
  content: string
) {
  return content.replace(REGEX_IDL_LOCATION, (full, first, file, line) => {
    if (file.includes(`_${NOTEBOOK_CELL_BASE_NAME}_`)) {
      /** Get URI for notebook */
      const uri =
        IDLFileHelper.getParentNotebookURIFromNotebookCellFSPath(file);

      /** Get proper FS path */
      const fsPath = CleanPath(uri.fsPath);

      /** Get URI as string */
      const uriString = uri.toString();

      // check if known
      if (uriString in controller.knownNotebooks) {
        /** Get URI for cell */
        const cellUri = IDLFileHelper.notebookCellFSPathToUri(file).toString();

        /** Get the cell we are in */
        const cellIdx = controller.knownNotebooks[uriString]
          .getCells()
          .map((nbCell) => nbCell.document.uri.toString())
          .indexOf(cellUri);

        if (cellIdx !== -1) {
          return `At: ${basename(fsPath)}, Cell ${cellIdx + 1}, Line ${line}`;
        }
      }

      // default answer
      return `At: ${basename(fsPath)}, Line ${line}`;
    } else {
      return full;
    }
  });
}

/**
 * Replace paths from running code
 */
function ReplaceLivePaths(controller: IDLNotebookController, content: string) {
  return content.replace(
    REGEX_STOP_DETECTION,
    (full, reason, routine, line, inFile) => {
      /** Remove white  */
      const file = inFile.replace(/\r*\n {2}/gim, '');

      if (file.includes(`_${NOTEBOOK_CELL_BASE_NAME}_`)) {
        /** Get URI for notebook */
        const uri =
          IDLFileHelper.getParentNotebookURIFromNotebookCellFSPath(file);

        /** Get proper FS path */
        const fsPath = CleanPath(uri.fsPath);

        /** Get URI as string */
        const uriString = uri.toString();

        // check if known
        if (uriString in controller.knownNotebooks) {
          /** Get URI for cell */
          const cellUri =
            IDLFileHelper.notebookCellFSPathToUri(file).toString();

          /** Get the cell we are in */
          const cellIdx = controller.knownNotebooks[uriString]
            .getCells()
            .map((nbCell) => nbCell.document.uri.toString())
            .indexOf(cellUri);

          if (cellIdx !== -1) {
            return `${reason}: ${routine}, Notebook: ${basename(
              fsPath
            )}, Cell ${cellIdx + 1}, Line ${line}`;
          }
        }

        // default answer
        return `${reason}: ${routine}, Notebook: ${basename(
          fsPath
        )}, Line ${line}`;
      } else {
        return full;
      }
    }
  );
}

/**
 * Cleans up paths for content in notebook cells to make easy to read
 *
 * Works here because we always process all the content for a cell at once
 * whereas the debug console is one chunk at a time.
 *
 * TODO: Merge the logic in the two functions to be simpler
 */
export function ReplaceNotebookPaths(
  controller: IDLNotebookController,
  content: string
) {
  content = ReplaceSyntaxErrorPaths(controller, content);
  content = ReplaceLivePaths(controller, content);
  return content;
}
