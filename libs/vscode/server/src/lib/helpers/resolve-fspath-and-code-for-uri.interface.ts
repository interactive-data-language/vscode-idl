import { TextDocument } from 'vscode-languageserver-textdocument';

export interface IResolvedFSPathAndCodeForURI {
  uri: string;
  fsPath: string;
  isNotebook: boolean;
  code: string;
  doc?: TextDocument;
}
