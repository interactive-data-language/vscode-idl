import { IDL_LSP_LOG } from '@idl/logger';
import { NUM_WORKERS } from '@idl/parsing/index';
import {
  RoundToNearest,
  SystemMemoryGB,
  SystemMemoryUsedGB,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ILanguageServerStartupPayload,
  USAGE_METRIC_LOOKUP,
} from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { arch, cpus, platform } from 'os';

import { CacheValidFSPath } from '../helpers/cache-valid';
import { SendProblems } from '../helpers/send-problems';
import { SendUsageMetricServer } from '../helpers/send-usage-metric-server';
import { IDL_CLIENT_CONFIG } from '../helpers/track-workspace-config';
import {
  GLOBAL_SERVER_SETTINGS,
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_EVENT_MANAGER,
} from '../initialize-server';
import { CONFIG_INITIALIZATION } from './custom-events/on-workspace-config';
import { WORKSPACE_INITIALIZATION } from './events/on-initialized';
import { IDL_INDEX } from './initialize-file-manager';

/**
 * Timeout for all global promises if we don't get the right responses
 */
export const PROMISE_TIMEOUT = 5000;

/**
 * Set a flag to make sure that we can send problems
 */
export let CAN_SEND_PROBLEMS = false;

/**
 * Flag if we have been resolved
 */
let IS_RESOLVED = false;

/**
 * Promise resolver
 */
let RESOLVER: () => void;

/**
 * Global promise that makes sure our critical information about our configuration
 *
 * Automatically resolves after 5 seconds in case we don't get this message
 */
export const SERVER_INITIALIZED = new Promise<void>((res) => {
  RESOLVER = res;
});

/**
 * Global promise that tracks if our server has been initialized which means
 * we have all of our config files from the VSCode client.
 *
 * Auto resolves after 5 seconds as this is a blocking operation
 */
export const SERVER_INFO = Promise.all([
  CONFIG_INITIALIZATION,
  WORKSPACE_INITIALIZATION,
]);

// on initialization, load global tokens
SERVER_INFO.then(async (res) => {
  try {
    // alert users
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: [
        'Loading global tokens and filtering the following internal routines:',
        IDL_CLIENT_CONFIG.developer,
      ],
    });

    IDL_INDEX.loadGlobalTokens(IDL_CLIENT_CONFIG);

    /**
     * Merge folders together
     */
    const merged = { ...res[0], ...res[1] };

    // alert users
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Server initialized, indexing code in these folders:', merged],
    });

    // alert that we have started indexing
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
      { type: 'start' }
    );

    try {
      // get start time
      const t0 = performance.now();

      /**
       * Merge folders that we need to process.
       *
       * The second promise (for workspace) should win because it will
       * always be recursive
       */
      const files = await IDL_INDEX.indexWorkspace(
        merged,
        GLOBAL_SERVER_SETTINGS.fullParse
      );

      // init cache for all files if we did a full parse
      if (GLOBAL_SERVER_SETTINGS.fullParse) {
        for (let i = 0; i < files.length; i++) {
          CacheValidFSPath(files[i]);
        }
      }

      /**
       * Get startup stats
       */
      const stats = IDL_INDEX.lastWorkspaceIndexStats;

      // check if we have stats
      if (stats.haveStats) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const statsDetail: ILanguageServerStartupPayload = {
          app_platform: platform(),
          app_arch: arch(),
          app_cpus: cpus().length,
          app_ram: SystemMemoryGB(),
          app_ram_used: SystemMemoryUsedGB(),
          num_workers: NUM_WORKERS,
          parse_time: RoundToNearest(stats.time / 1000, 0.01),
          parse_rate: Math.round(stats.lines / (stats.time / 1000)),
          num_pro: IDL_INDEX.fileTypes['pro'].size,
          num_save: IDL_INDEX.fileTypes['save'].size,
          num_idl_task: IDL_INDEX.fileTypes['idl-task'].size,
          num_envi_task: IDL_INDEX.fileTypes['envi-task'].size,
          num_idl_json: IDL_INDEX.fileTypes['idl.json'].size,
        };

        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_LSP_LOG,
          type: 'info',
          content: [
            `Finished indexing ${files.length} files in ${Math.floor(
              performance.now() - t0
            )} ms, see below for additional information`,
            { lines: stats.lines, ...statsDetail },
          ],
        });

        // round numbers to obfuscate information and simplify metrics that
        // we report
        statsDetail.parse_time = RoundToNearest(statsDetail.parse_time, 1);
        statsDetail.parse_rate = RoundToNearest(statsDetail.parse_rate, 1000);
        statsDetail.num_pro = RoundToNearest(statsDetail.num_pro, 25);
        statsDetail.num_save = RoundToNearest(statsDetail.num_save, 25);
        statsDetail.num_idl_task = RoundToNearest(statsDetail.num_idl_task, 5);
        statsDetail.num_envi_task = RoundToNearest(
          statsDetail.num_envi_task,
          5
        );
        statsDetail.num_idl_json = RoundToNearest(statsDetail.num_idl_json, 5);

        // send usage metric
        SendUsageMetricServer(
          USAGE_METRIC_LOOKUP.LANGUAGE_SERVER_STARTUP,
          statsDetail
        );
      } else {
        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_LSP_LOG,
          type: 'info',
          content: [
            `Finished indexing ${files.length} files in ${Math.floor(
              performance.now() - t0
            )} ms`,
          ],
        });
      }
    } catch (err) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'error',
        content: [IDL_TRANSLATION.lsp.index.failedIndexWorkspace, err],
        alert: IDL_TRANSLATION.lsp.index.failedIndexWorkspace,
      });
    }

    // resolve our blocker
    if (!IS_RESOLVED) {
      RESOLVER();
      IS_RESOLVED = true;
    }

    // update flag that we can send problems
    CAN_SEND_PROBLEMS = true;

    // send problems with settings changes
    SendProblems(Object.keys(IDL_INDEX.getSyntaxProblems()));

    // alert that we are done
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
      { type: 'finish' }
    );
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: [IDL_TRANSLATION.lsp.index.failedIndexWorkspace, err],
      alert: IDL_TRANSLATION.lsp.index.failedIndexWorkspace,
    });
  }
});
