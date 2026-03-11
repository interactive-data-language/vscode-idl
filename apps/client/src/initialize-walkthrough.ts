import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

/**
 * Initializes walkthrough commands for the Getting Started experience
 */
export function InitializeWalkthrough(ctx: ExtensionContext) {
  // Register command to open IDL settings
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      'idl.walkthrough.openSettings',
      async () => {
        await vscode.commands.executeCommand(
          'workbench.action.openSettings',
          '@ext:idl.idl-for-vscode'
        );
      }
    )
  );

  // Register command to create a new IDL file
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      'idl.walkthrough.createIDLFile',
      async () => {
        const doc = await vscode.workspace.openTextDocument({
          language: 'idl',
          content: '; IDL Hello World\nprint, "Hello from IDL!"\n',
        });
        await vscode.window.showTextDocument(doc);
      }
    )
  );

  // Register command to show welcome message
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      'idl.walkthrough.welcomeMessage',
      async () => {
        await vscode.window.showInformationMessage(
          'Welcome to IDL for VS Code! This extension provides comprehensive IDL support including syntax highlighting, debugging, and more.'
        );
      }
    )
  );

  // Register command to open IDL terminal
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      'idl.walkthrough.openTerminal',
      async () => {
        await vscode.commands.executeCommand('idl.terminal.startIDL');
      }
    )
  );
}
