import * as vscode from 'vscode';

/**
 * Replaces the content of a document using a reference to the editor class
 */
export async function ReplaceEditorContent(
  editor: vscode.TextEditor,
  content: string
) {
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
