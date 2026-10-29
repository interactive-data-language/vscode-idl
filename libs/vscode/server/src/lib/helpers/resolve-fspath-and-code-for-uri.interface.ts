import type { ParsedType } from '@idl/types/syntax-tree';
import type { TextDocument } from 'vscode-languageserver-textdocument';

export interface IResolvedFSPathAndCodeForURI {
  /** Content of the file/URI */
  code: string;
  /** Text doc reference  */
  doc?: TextDocument;
  /** Path to the file on disk */
  fsPath: string;
  /** What kind of doc did we find, really just for checking notebooks */
  type: ParsedType;
  /** URI from VSCode */
  uri: string;
}
