import { TextDocument } from 'vscode';
import * as vscode from 'vscode';

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

  // get the active text editor
  const editor = vscode.window.activeTextEditor;

  // edit by replacing the file's contents
  await editor.edit((editBuilder) => {
    editBuilder.replace(
      new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
      ),
      content
    );
  });
}
