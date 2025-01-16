// import './polyfills';

import { ExtensionContext } from 'vscode';

// MEASUREMENT.ID = environment.measurement;

console.log('loaded JS!');

/**
 * Function that activates our extension
 */
export async function activate(ctx: ExtensionContext) {
  console.log('They want me to activate!');

  try {
    // InitializeTranslation('en');
    // InitializeLogger(() => {
    //   // do nothing
    // });
    // // set logging callback for metrics
    // SetUsageMetricLogger((ev, payload) => {
    //   // do nothing because VSCode has a dedicated channel for viewing telemetry
    //   // and logs it for you
    // });
    // InitializeUsageMetrics();
    // await InitializeExtensionConfig(() => {
    //   // do nothing on config changes
    // });
    // // initialize our tree view
    // InitializeTree(ctx);
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
