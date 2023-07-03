import { EXTENSION_FOLDER } from '@idl/vscode/client';
import { join } from 'path';
import * as vscode from 'vscode';

export class IDLAction extends vscode.TreeItem {
  contextValue = 'IDLAction';
  constructor(
    readonly label: string,
    private version: string,
    readonly collapsibleState: vscode.TreeItemCollapsibleState,
    private iconName: string,
    readonly commandName: string
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
      light: join(EXTENSION_FOLDER, 'extension', 'images', 'light', iconName),
      dark: join(EXTENSION_FOLDER, 'extension', 'images', 'dark', iconName),
    };
  }
}
