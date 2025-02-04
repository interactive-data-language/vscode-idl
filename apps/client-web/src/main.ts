// import './polyfills';

import { IDL_LOG } from '@idl/logger';
import { InitializeTranslation } from '@idl/translation';
import {
  InitializeUsageMetrics,
  MEASUREMENT,
  SetUsageMetricLogger,
} from '@idl/usage-metrics';
import { LoadLanguageConfiguration } from '@idl/vscode/client-shared';
import {
  IDL_EXTENSION_CONFIG,
  InitializeExtensionConfig,
  SendPreferenceUsageMetrics,
} from '@idl/vscode/config';
import { IDL_LOGGER, InitializeLogger } from '@idl/vscode/logger';
import { InitializeTree } from '@idl/vscode/tree-view';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import { environment } from './environments/environment';
import { ON_CONFIG_CHANGES_CLIENT_WEB } from './helpers/on-config-changes-client-web';

MEASUREMENT.ID = environment.measurement;

/**
 * Function that activates our extension
 */
export async function activate(ctx: ExtensionContext) {
  try {
    InitializeTranslation('en');

    InitializeLogger(() => {
      // do nothing
    });

    /**
     * Log basic information about IDL and the preferences
     */
    IDL_LOGGER.log({
      log: IDL_LOG,
      type: 'info',
      content: `Extension running in web mode`,
    });

    // set language configuration
    LoadLanguageConfiguration();

    /** Dont await - blocking questions asked to client if you do */
    InitializeExtensionConfig(ON_CONFIG_CHANGES_CLIENT_WEB);

    // set logging callback for metrics
    SetUsageMetricLogger((ev, payload) => {
      // do nothing because VSCode has a dedicated channel for viewing telemetry
      // and logs it for you
    });
    InitializeUsageMetrics();
    SendPreferenceUsageMetrics();

    // update logger configuration and log information about our workspace config
    IDL_LOGGER.setDebug(IDL_EXTENSION_CONFIG.debugMode);

    // RegisterClientSharedCommands(ctx);

    // initialize our tree view
    InitializeTree(ctx);
  } catch (err) {
    vscode.window.showErrorMessage(
      'Failed to activate IDL for VSCode extension'
    );
    console.log(err);
  }
}

/**
 * Manages stopping/deactivating our extension
 */
export async function deactivate(): Promise<void> {
  console.log('I have deactivated!');
}
