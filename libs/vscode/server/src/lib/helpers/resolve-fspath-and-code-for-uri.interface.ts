import { ParsedType } from '@idl/parsing/syntax-tree';
import { TextDocument } from 'vscode-languageserver-textdocument';

export interface IResolvedFSPathAndCodeForURI {
  /** URI from VSCode */
  uri: string;
  /** Path to the file on disk */
  fsPath: string;
  /** What kind of doc did we find, really just for checking notebooks */
  type: ParsedType;
  /** Content of the file/URI */
  code: string;
  /** Text doc reference  */
  doc?: TextDocument;
}
