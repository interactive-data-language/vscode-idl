import { WEB_VIEW_PANEL_ID } from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';

/**
 * Adds web view information to our package.json file
 */
export function ProcessWebView(packageJSON: IPackageJSON, nls: IPackageNLS) {
  packageJSON['activationEvents'].push(`onWebviewPanel:${WEB_VIEW_PANEL_ID}`);
}
