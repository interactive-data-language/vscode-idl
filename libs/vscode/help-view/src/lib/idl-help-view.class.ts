import * as vscode from 'vscode';

/**
 * Virtual document provider for viewing IDL's help content in visual studio code
 */
export class IDLHelpView implements vscode.TextDocumentContentProvider {
  // emitter and its event
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  provideTextDocumentContent(uri: vscode.Uri): string {
    return 'this works worrectly';
  }
}
