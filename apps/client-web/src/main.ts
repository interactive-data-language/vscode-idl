// import './polyfills';

import { InitializeTranslation } from '@idl/translation';
import {
  InitializeUsageMetrics,
  MEASUREMENT,
  SetUsageMetricLogger,
} from '@idl/usage-metrics';
import {
  InitializeExtensionConfig,
  SendPreferenceUsageMetrics,
} from '@idl/vscode/config';
import { InitializeLogger } from '@idl/vscode/logger';
import { InitializeTree } from '@idl/vscode/tree-view';
import { ExtensionContext } from 'vscode';

import { environment } from './environments/environment';

MEASUREMENT.ID = environment.measurement;

console.log('loaded JS!');

/**
 * Function that activates our extension
 */
export async function activate(ctx: ExtensionContext) {
  console.log('They want me to activate!');

  try {
    InitializeTranslation('en');
    InitializeLogger(() => {
      // do nothing
    });

    await InitializeExtensionConfig(() => {
      // do nothing on config changes
    });

    // set logging callback for metrics
    SetUsageMetricLogger((ev, payload) => {
      // do nothing because VSCode has a dedicated channel for viewing telemetry
      // and logs it for you
    });
    InitializeUsageMetrics();
    SendPreferenceUsageMetrics();

    // initialize our tree view
    InitializeTree(ctx);
  } catch (err) {
    console.log(err);
  }
  console.log('I have finished activation!');
}

/**
 * Manages stopping/deactivating our extension
 */
export async function deactivate(): Promise<void> {
  console.log('I have deactivated!');
}
