import { platform } from 'os';
import { basename, dirname, join } from 'path';
import { URI } from 'vscode-uri';

import { CleanPath } from './clean-path';
import { NOTEBOOK_CELL_BASE_NAME } from './idl-file-helper.interface';
import {
  IDL_JSON_URI,
  IDL_NOTEBOOK_EXTENSION,
  IDL_SAVE_FILE_EXTENSION,
  PRO_FILE_EXTENSION,
  TASK_FILE_EXTENSION,
} from './language.interface';

/**
 * Helper class to determine what kind of file a file is
 *
 * Shared logic across the extension
 */
export class IDLFileHelper {
  /**
   * Indicates if we have a file that we can process for tokens (PRO code).
   *
   * This is needed because we have other files that we watch as well.
   */
  static isPROCode(file: string): boolean {
    return file.toLowerCase().endsWith(PRO_FILE_EXTENSION);
  }

  /**
   * Indicates that a file is a configuration file
   */
  static isConfigFile(file: string): boolean {
    return file.toLowerCase().endsWith(IDL_JSON_URI);
  }

  /**
   * Indicates that a file is a task file (IDL, ENVI, etc.)
   */
  static isTaskFile(file: string): boolean {
    return file.toLowerCase().endsWith(TASK_FILE_EXTENSION);
  }

  /**
   * Indicates that a file is an IDL notebook
   */
  static isIDLNotebookFile(file: string): boolean {
    return (
      file.includes('#') || file.toLowerCase().endsWith(IDL_NOTEBOOK_EXTENSION)
    );
  }

  /**
   * Indicates that a file is a SAVE file
   */
  static isSAVEFile(file: string): boolean {
    return file.toLowerCase().endsWith(IDL_SAVE_FILE_EXTENSION);
  }

  /**
   * Converts a URI for a notebook cell to the filepath on disk that should be used
   */
  static notebookCellUriToFSPath(uri: URI) {
    return join(
      CleanPath(dirname(uri.fsPath)),
      `${basename(
        uri.fsPath,
        IDL_NOTEBOOK_EXTENSION
      )}_${NOTEBOOK_CELL_BASE_NAME}_${uri.fragment}.pro`
    );
  }

  /**
   * Determines if a path is a notebook cell or not
   */
  static isNotebookCell(fsPath: string) {
    return basename(fsPath).includes(`_${NOTEBOOK_CELL_BASE_NAME}_`);
  }

  /**
   * Converts a file system path for a notebook call back to a URI for
   * a notebook cell
   */
  static notebookCellFSPathToUri(fsPath: string) {
    const split = fsPath.split(`_${NOTEBOOK_CELL_BASE_NAME}_`);
    return URI.from({
      scheme: 'vscode-notebook-cell',
      path: `${platform() === 'win32' ? '/' : ''}${split[0].replace(
        /\\/g,
        '/'
      )}${IDL_NOTEBOOK_EXTENSION}`,
      fragment: basename(split[1], `.pro`),
    });
  }

  /**
   * Returns the VSCode URI for a notebook document from the FS path
   * for a notebook cell
   */
  static getParentNotebookFSPathFromNotebookCellFSPath(fsPath: string) {
    return (
      fsPath.split(`_${NOTEBOOK_CELL_BASE_NAME}_`)[0] + IDL_NOTEBOOK_EXTENSION
    );
  }

  /**
   * Returns the VSCode URI for a notebook document from the FS path
   * for a notebook cell
   */
  static getParentNotebookURIFromNotebookCellFSPath(fsPath: string) {
    return URI.file(this.getParentNotebookFSPathFromNotebookCellFSPath(fsPath));
  }
}
