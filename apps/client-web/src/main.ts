import { MEASUREMENT } from '@idl/usage-metrics';
import { ExtensionContext } from 'vscode';

import { environment } from './environments/environment';

MEASUREMENT.ID = environment.measurement;

console.log('loaded JS!');

/**
 * Function that activates our extension
 */
export async function activate(ctx: ExtensionContext): Promise<void> {
  // InitializeTranslation('en');

  // ctx.extensionUri

  // const ext = vscode.extensions.getExtension(EXTENSION_NAME);

  // console.log(ext.extensionPath);

  // const contents = await vscode.workspace.fs.readFile();

  // readFileSync(GetExtensionPath('idl/routines/global.json'), {
  //   encoding: 'utf-8',
  // });
  console.log('I have activated!');
}

/**
 * Manages stopping/deactivating our extension
 */
export async function deactivate(): Promise<void> {
  console.log('I have deactivated!');
}
