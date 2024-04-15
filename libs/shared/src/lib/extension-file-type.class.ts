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
export class ExtensionFileType {
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
}
