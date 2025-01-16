// import './polyfills';

import { InitializeTranslation } from '@idl/translation';
import { MEASUREMENT } from '@idl/usage-metrics';
import { InitializeExtensionConfig } from '@idl/vscode/config';
import { InitializeLogger } from '@idl/vscode/logger';
import { InitializeTree } from '@idl/vscode/tree-view';
import { ExtensionContext } from 'vscode';

import { environment } from './environments/environment';

MEASUREMENT.ID = environment.measurement;

console.log('loaded JS!');

/**
 * Function that activates our extension
 */
export default function activate(ctx: ExtensionContext) {
  console.log('They want me to activate!');

  try {
    InitializeLogger(() => {
      // do nothing
    });

    InitializeTranslation('en');

    // // set logging callback for metrics
    // SetUsageMetricLogger((ev, payload) => {
    //   // do nothing because VSCode has a dedicated channel for viewing telemetry
    //   // and logs it for you
    // });

    // InitializeUsageMetrics();

    InitializeExtensionConfig(() => {
      // do nothing on config changes
    });

    // initialize our tree view
    InitializeTree(ctx);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Manages stopping/deactivating our extension
 */
export async function deactivate(): Promise<void> {
  console.log('I have deactivated!');
}
