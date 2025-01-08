import { MEASUREMENT } from '@idl/usage-metrics';
import { ExtensionContext } from 'vscode';

import { environment } from './environments/environment';

MEASUREMENT.ID = environment.measurement;

/**
 * Function that activates our extension
 */
export async function activate(ctx: ExtensionContext): Promise<void> {
  console.log('I have activated!');
}

/**
 * Manages stopping/deactivating our extension
 */
export async function deactivate(): Promise<void> {
  console.log('I have deactivated!');
}
