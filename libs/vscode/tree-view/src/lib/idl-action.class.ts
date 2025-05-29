import { join } from 'path';
import * as vscode from 'vscode';

export class IDLAction extends vscode.TreeItem {
  contextValue = 'IDLAction';
  constructor(
    readonly label: string,
    private version: string,
    readonly collapsibleState: vscode.TreeItemCollapsibleState,
    private iconName: string,
    readonly commandName: string,
    private extensionFolder: string
  ) {
    super(label, collapsibleState);

    // update tooltip and description
    this.tooltip = `${this.label} ${this.version}`;
    this.description = this.version;

    // check if we are a parent or child
    this.contextValue =
      collapsibleState === vscode.TreeItemCollapsibleState.Expanded
        ? 'parent'
        : 'child';

    this.iconPath = {
      light: vscode.Uri.file(
        join(extensionFolder, 'extension', 'images', 'light', iconName)
      ),
      dark: vscode.Uri.file(
        join(extensionFolder, 'extension', 'images', 'dark', iconName)
      ),
    };
  }
}
