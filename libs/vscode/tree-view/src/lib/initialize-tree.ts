import { IDL_LOGGER } from '@idl/vscode/logger';
import { ExtensionContext } from 'vscode';

import { IDLTreeClickHandler } from './idl-tree-click-handler';
import { IDLTreeViewProvider } from './idl-tree-view-provider';

export let TREE_VIEW_CLICK_HANDLER: IDLTreeClickHandler;

export let TREE_VIEW_PROVIDER: IDLTreeViewProvider;

/**
 * Initializes our tree views
 */
export function InitializeTree(ctx: ExtensionContext, web: boolean) {
  // make our tree click handler
  TREE_VIEW_CLICK_HANDLER = new IDLTreeClickHandler();

  // generate our tree provider and get the view for listening to events
  IDL_LOGGER.log({ content: 'Creating IDL tree view' });
  TREE_VIEW_PROVIDER = new IDLTreeViewProvider(ctx.extensionPath, web);
  TREE_VIEW_PROVIDER.createView();
}
