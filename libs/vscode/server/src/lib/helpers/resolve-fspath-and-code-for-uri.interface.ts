import { ParsedType } from '@idl/parsing/syntax-tree';
import { TextDocument } from 'vscode-languageserver-textdocument';

export interface IResolvedFSPathAndCodeForURI {
  uri: string;
  fsPath: string;
  type: ParsedType;
  code: string;
  doc?: TextDocument;
}
