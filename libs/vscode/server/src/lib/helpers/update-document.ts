import { WorkspaceChange } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { DOCUMENT_MANAGER } from '../events/initialize-document-manager';
import { SERVER_CONNECTION } from '../initialize-server';

/**
 * Updates the content of a file with something new
 *
 * Uses a single edit and replaces everything
 */
export async function UpdateDocument(
  uri: string,
  content: string,
  codeDoc?: TextDocument
) {
  // create workspace change for file
  const change = new WorkspaceChange();

  // get the text document so we can get the version
  const doc = codeDoc !== undefined ? codeDoc : DOCUMENT_MANAGER.get(uri);

  // create edits for our file
  const edits = change.getTextEditChange({
    uri,
    version: doc.version,
  });

  // replace content of editor
  edits.replace(
    {
      start: { line: 0, character: 0 },
      end: { line: Number.MAX_VALUE, character: Number.MAX_VALUE },
    },
    content
  );

  // sync our file changes
  await SERVER_CONNECTION.workspace.applyEdit(change.edit);
}
