import { IDL_TREE_VIEW_ID } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { IDLAction } from './idl-action.class';
import { TREE_VIEW_CLICK_HANDLER } from './initialize-tree';
import { CODE_ACTIONS } from './trees/code-actions.tree.interface';
import { DEBUGGING_BUTTONS } from './trees/debugging.tree.interface';
import { NOTEBOOK_ACTIONS } from './trees/notebook-actions.tree.interface';
import { ADDITIONAL_ACTIONS } from './trees/quick-access.tree.interface';

export class IDLTreeViewProvider implements vscode.TreeDataProvider<IDLAction> {
  /**
   * Parent nodes
   */
  parents: { [key: string]: IDLAction };

  /**
   * Node of trees
   */
  tree: { [key: string]: IDLAction[] };

  onDidChangeTreeData: vscode.Event<IDLAction | undefined>;

  private _onDidChangeTreeData: vscode.EventEmitter<IDLAction | undefined> =
    new vscode.EventEmitter<IDLAction | undefined>();

  constructor() {
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    // build our tree
    this._buildTree();
  }

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: IDLAction): vscode.TreeItem {
    return element;
  }

  getParent(element: IDLAction): vscode.ProviderResult<IDLAction | null> {
    if (this.tree[element.label]) {
      return null;
    }

    const parents = Object.keys(this.tree);
    for (let i = 0; i < parents.length; i++) {
      const idx = this.tree[parents[i]]
        .map((c) => c.label)
        .indexOf(element.label);
      if (idx !== -1) {
        return this.parents[parents[i]];
      }
    }
    return null;
  }

  getChildren(element?: IDLAction): Thenable<IDLAction[]> {
    // return all of our parent elements
    switch (true) {
      case !element: {
        const keys = Object.keys(this.parents);
        return Promise.resolve(keys.map((key) => this.parents[key]));
      }
      case element.label in this.tree:
        return Promise.resolve(this.tree[element.label]);
      default:
        return Promise.resolve([]);
    }
  }

  /**
   * Create the tree view and listen to events
   */
  createView() {
    // listen for events and register
    const treeView = vscode.window.createTreeView(IDL_TREE_VIEW_ID, {
      treeDataProvider: this,
    });

    // listen for when we click on items in the tree view
    treeView.onDidChangeSelection(async (event) => {
      // handle our click event
      try {
        await TREE_VIEW_CLICK_HANDLER.clickedItem(event.selection[0]);
        const kids = await this.getChildren();
        await treeView.reveal(kids[0], { select: true });
      } catch (err) {
        IDL_LOGGER.log({
          type: 'error',
          content: ['Error while handling selection change in IDL tree', err],
          alert: IDL_TRANSLATION.idl.tree.selectionChangeError,
        });
      }
    });
  }

  /**
   * Makes the tree view in the sidebar
   */
  private _buildTree() {
    // initialize objects to track parent and child nodes
    this.parents = {};
    this.tree = {};

    /**
     * Add debugging branch and children
     */
    this.parents[IDL_TRANSLATION.idl.tree.parents.debugging] = new IDLAction(
      // override type, OK because click handler ignores parents
      IDL_TRANSLATION.idl.tree.parents.debugging,
      '',
      vscode.TreeItemCollapsibleState.Expanded,
      'idlicon.svg',
      ''
    );
    this.tree[IDL_TRANSLATION.idl.tree.parents.debugging] =
      DEBUGGING_BUTTONS.map(
        (child) =>
          new IDLAction(
            child.name,
            child.description,
            vscode.TreeItemCollapsibleState.None,
            child.icon,
            child.commandName
          )
      );

    // // add terminal parents and children
    // this.parents[IDL_TRANSLATION.idl.tree.parents.terminal] = new IDLAction(
    //   // override type, OK because click handler ignores parents
    //   IDL_TRANSLATION.idl.tree.parents.terminal,
    //   '',
    //   vscode.TreeItemCollapsibleState.Expanded,
    //   'terminal.svg',
    //   ''
    // );
    // this.tree[IDL_TRANSLATION.idl.tree.parents.terminal] = TERMINAL_BUTTONS.map(
    //   (child) =>
    //     new IDLAction(
    //       child.name,
    //       child.description,
    //       vscode.TreeItemCollapsibleState.None,
    //       child.icon,
    //       child.commandName
    //     )
    // );

    /**
     * Add code actions
     */
    this.parents[IDL_TRANSLATION.idl.tree.parents.codeActions] = new IDLAction(
      // override type, OK because click handler ignores parents
      IDL_TRANSLATION.idl.tree.parents.codeActions,
      '',
      vscode.TreeItemCollapsibleState.Expanded,
      'code.svg',
      ''
    );
    this.tree[IDL_TRANSLATION.idl.tree.parents.codeActions] = CODE_ACTIONS.map(
      (child) =>
        new IDLAction(
          child.name,
          child.description,
          vscode.TreeItemCollapsibleState.None,
          child.icon,
          child.commandName
        )
    );

    /**
     * Add notebook commands
     */
    this.parents[IDL_TRANSLATION.idl.tree.parents.notebooks] = new IDLAction(
      // override type, OK because click handler ignores parents
      IDL_TRANSLATION.idl.tree.parents.notebooks,
      '',
      vscode.TreeItemCollapsibleState.Expanded,
      'post.svg',
      ''
    );
    this.tree[IDL_TRANSLATION.idl.tree.parents.notebooks] =
      NOTEBOOK_ACTIONS.map(
        (child) =>
          new IDLAction(
            child.name,
            child.description,
            vscode.TreeItemCollapsibleState.None,
            child.icon,
            child.commandName
          )
      );

    /**
     * Additional commands/actions that we want to have buttons for
     */
    this.parents[IDL_TRANSLATION.idl.tree.parents.quickAccess] = new IDLAction(
      // override type, OK because click handler ignores parents
      IDL_TRANSLATION.idl.tree.parents.quickAccess,
      '',
      vscode.TreeItemCollapsibleState.Expanded,
      'quick-reference-all.svg',
      ''
    );
    this.tree[IDL_TRANSLATION.idl.tree.parents.quickAccess] =
      ADDITIONAL_ACTIONS.map(
        (child) =>
          new IDLAction(
            child.name,
            child.description,
            vscode.TreeItemCollapsibleState.None,
            child.icon,
            child.commandName
          )
      );
  }
}
