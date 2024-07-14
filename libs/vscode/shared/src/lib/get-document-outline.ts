import * as vscode from 'vscode';

/**
 * Gets the outline of a document using the VSCode command API
 *
 * Returns the outline we generate in the language server
 */
export async function GetDocumentOutline(
  doc: vscode.TextDocument
): Promise<vscode.DocumentSymbol[]> {
  return await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
    'vscode.executeDocumentSymbolProvider',
    doc.uri
  );
}
