import { IDLIndex, NUM_WORKERS } from '@idl/parsing/index';
import { TextDocuments } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_CONNECTION,
} from '../initialize-server';
import { ON_DID_CHANGE_CONTENT } from './documents/on-did-change-content';
import { ON_DID_CHANGE_WATCHED_FILES } from './documents/on-did-change-watched-files';
import { ON_DID_CLOSE } from './documents/on-did-close';
import { ON_DID_OPEN } from './documents/on-did-open';
import { ON_DOCUMENT_FORMATTING } from './documents/on-document-formatting';
import { ON_DOCUMENT_SYMBOL } from './documents/on-document-symbol';
import { ON_INITIALIZED } from './documents/on-initialized';

/**
 * Text document manager which handles full document syncs
 */
export const DOCUMENT_MANAGER: TextDocuments<TextDocument> = new TextDocuments(
  TextDocument
);

/**
 * Index of IDL code that manages symbols from code
 */
export let IDL_INDEX: IDLIndex;

/**
 * Initializes our document manager and handles all of the symbol/problem detection
 */
export function InitializeDocumentManager() {
  IDL_INDEX = new IDLIndex(IDL_LANGUAGE_SERVER_LOGGER, NUM_WORKERS, false);

  /**
   * Set everything up once our connection has been initialized
   */
  SERVER_CONNECTION.onInitialized(ON_INITIALIZED);

  /**
   * Listen for file changes in our workspace
   */
  SERVER_CONNECTION.onDidChangeWatchedFiles(ON_DID_CHANGE_WATCHED_FILES);

  /**
   * Listen for code formatting requests
   *
   * Override the type because its not smart enough to recognize optional
   * parameters that do not break the patterns that exist
   */
  SERVER_CONNECTION.onDocumentFormatting(ON_DOCUMENT_FORMATTING as any);

  /**
   * Listen for document symbols
   */
  SERVER_CONNECTION.onDocumentSymbol(ON_DOCUMENT_SYMBOL);

  /**
   * Listen for closing documents
   */
  DOCUMENT_MANAGER.onDidClose(ON_DID_CLOSE);

  /**
   * Call back when the content of files has changed
   */
  DOCUMENT_MANAGER.onDidChangeContent(ON_DID_CHANGE_CONTENT);

  /**
   * Callback when a file is opened
   */
  DOCUMENT_MANAGER.onDidOpen(ON_DID_OPEN);

  /**
   * Callback when a file is opened
   */
  // SERVER_CONNECTION.didRena;

  /**
   * These are from the original code, not sure if they are needed or not
   */
  // connection.onDidOpenTextDocument((params) => {
  // 	// A text document got opened in VSCode.
  // 	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
  // 	// params.text the initial full content of the document.
  // 	connection.console.log(`${params.textDocument.uri} opened.`);
  // });
  // connection.onDidChangeTextDocument((params) => {
  // 	// The content of a text document did change in VSCode.
  // 	// params.uri uniquely identifies the document.
  // 	// params.contentChanges describe the content changes to the document.
  // 	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
  // });
  // connection.onDidCloseTextDocument((params) => {
  // 	// A text document got closed in VSCode.
  // 	// params.uri uniquely identifies the document.
  // 	connection.console.log(`${params.textDocument.uri} closed.`);
  // });

  // Make the text document manager listen on the connection
  // for open, change and close text document events
  DOCUMENT_MANAGER.listen(SERVER_CONNECTION);
}
