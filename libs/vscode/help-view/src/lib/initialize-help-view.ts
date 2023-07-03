import { ExtensionContext } from 'vscode';

import { IDLHelpView } from './idl-help-view.class';

/**
 * Reference
 */
let IDL_HELP_PROVIDER: IDLHelpView;

/**
 * Registers our view for IDL's markdown help within VSCode
 */
export function InitializeIDLHelpView(ctx: ExtensionContext) {
  // create our help view provider constant
  IDL_HELP_PROVIDER = new IDLHelpView();
}
