import { TextDocument } from 'vscode';
import * as vscode from 'vscode';

import { ReplaceEditorContent } from './replace-editor-content';
import { VSCODE_COMMANDS } from './vscode-commands.interface';

/**
 * replaces the content in a document using the edit API
 */
export async function ReplaceDocumentContent(
  doc: TextDocument,
  content: string
) {
  // make sure file is active in the editor by opening
  vscode.commands.executeCommand<vscode.TextDocumentShowOptions>(
    VSCODE_COMMANDS.OPEN_FILE,
    doc.uri
  );

  await ReplaceEditorContent(vscode.window.activeTextEditor, content);
}
