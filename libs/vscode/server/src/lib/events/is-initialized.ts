import { IDL_LSP_LOG } from '@idl/logger';
import { NUM_WORKERS } from '@idl/parsing/index';
import { IDL_PROBLEM_CODE_ALIAS_LOOKUP } from '@idl/parsing/problem-codes';
import {
  GetExtensionPath,
  RoundToNearest,
  SystemMemoryGB,
  SystemMemoryUsedGB,
  SystemMemoryUsedMB,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ILanguageServerStartupPayload,
  USAGE_METRIC_LOOKUP,
} from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { arch, cpus, platform } from 'os';

import { CacheValidFSPath } from '../helpers/cache-valid';
import {
  IGNORE_PROBLEM_CODES,
  INCLUDE_PROBLEMS_FOR,
} from '../helpers/merge-config';
import { SendProblems } from '../helpers/send-problems';
import { SendUsageMetricServer } from '../helpers/send-usage-metric-server';
import { IDL_CLIENT_CONFIG } from '../helpers/track-workspace-config';
import {
  GLOBAL_SERVER_SETTINGS,
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_EVENT_MANAGER,
} from '../initialize-server';
import { CONFIG_INITIALIZATION } from './custom-events/on-workspace-config';
import { WORKSPACE_INITIALIZATION } from './documents/on-initialized';
import { IDL_INDEX } from './initialize-document-manager';

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
    // log information about what we
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: [
        'Problem inclusion filters and ignore problem codes',
        INCLUDE_PROBLEMS_FOR,
        Object.keys(IGNORE_PROBLEM_CODES).map(
          (code) => IDL_PROBLEM_CODE_ALIAS_LOOKUP[code]
        ),
      ],
    });

    // send debug event about garbage collection
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Language server garbage collection enabled: ${
        global.gc ? true : false
      }`,
    });

    // send debug event about full parse
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Language server full parse: ${GLOBAL_SERVER_SETTINGS.fullParse}`,
    });

    // alert users
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: [
        'Loading global tokens and filtering the following internal routines:',
        IDL_CLIENT_CONFIG.developer,
      ],
    });

    // load global tokens
    IDL_INDEX.loadGlobalTokens(IDL_CLIENT_CONFIG);

    // log our memory usage at regular intervals
    setInterval(async () => {
      // track usage
      let usage = 0;

      // cleanup - wrap in try/catch because async
      try {
        usage = await IDL_INDEX.cleanUp();
      } catch (err) {
        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_LSP_LOG,
          type: 'error',
          content: [`Error while cleaning up child processes`, err],
        });
        usage = SystemMemoryUsedMB();
      }

      // print debug message about memory usage
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Memory cleanup and usage check (mb): ${usage}`,
      });
    }, 300000);

    /**
     * Merge folders together
     */
    const merged = { ...res[0], ...res[1] };

    // add in our IDL folder
    merged[GetExtensionPath('idl/vscode/notebooks')] = true;

    // alert users
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Server initialized, indexing code in these folders:', merged],
    });

    /**
     * Check if we can't detect the number of CPUs
     */
    if (cpus().length <= 0) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        content:
          'Unable to detect the number of CPUs, defaulting to 1 worker thread, performance may be impacted',
        type: 'warn',
      });
    }

    // alert that we have started indexing
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
      { type: 'start' }
    );

    try {
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

      /**
       * Get stats detail
       */
      const statsDetail: ILanguageServerStartupPayload = {
        app_platform: platform(),
        app_arch: arch(),
        app_cpus: cpus().length,
        app_ram: SystemMemoryGB(),
        app_ram_used: SystemMemoryUsedGB(),
        num_workers: NUM_WORKERS,
        parse_time: RoundToNearest(stats.timePro / 1000, 0.01),
        parse_rate: Math.round(stats.linesPro / (stats.timePro / 1000)),
        num_pro: IDL_INDEX.fileTypes['pro'].size,
        num_save: IDL_INDEX.fileTypes['save'].size,
        num_idl_task: IDL_INDEX.fileTypes['idl-task'].size,
        num_envi_task: IDL_INDEX.fileTypes['envi-task'].size,
        num_idl_json: IDL_INDEX.fileTypes['idl.json'].size,
        num_notebook: IDL_INDEX.fileTypes['idl-notebook'].size,
      };

      // log information to startup console
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: [
          `Finished indexing ${files.length} file(s) in ${stats.timeTotal} ms, see below for additional information`,
          {
            lines: stats.linesPro,
            ...statsDetail,
            time_total_ms: stats.timeTotal,
            time_search_ms: stats.timeSearch,
            time_config_ms: stats.timeConfig,
            time_task_ms: stats.timeTask,
            time_save_ms: stats.timeSave,
            time_notebook_ms: stats.timeNotebook,
            time_pro_ms: stats.timePro,
          },
        ],
      });

      /**
       * Round to simplify and add some obfuscation around metrics
       */
      statsDetail.parse_time = RoundToNearest(statsDetail.parse_time, 1);
      statsDetail.parse_rate = RoundToNearest(statsDetail.parse_rate, 1000);
      statsDetail.num_pro = RoundToNearest(statsDetail.num_pro, 25);
      statsDetail.num_save = RoundToNearest(statsDetail.num_save, 25);
      statsDetail.num_idl_task = RoundToNearest(statsDetail.num_idl_task, 5);
      statsDetail.num_envi_task = RoundToNearest(statsDetail.num_envi_task, 5);
      statsDetail.num_idl_json = RoundToNearest(statsDetail.num_idl_json, 5);
      statsDetail.num_notebook = RoundToNearest(statsDetail.num_notebook, 5);

      // send usage metric
      SendUsageMetricServer(
        USAGE_METRIC_LOOKUP.LANGUAGE_SERVER_STARTUP,
        statsDetail
      );
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

    // alert that we are done
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
      { type: 'finish' }
    );

    // send problems with settings changes
    SendProblems(Object.keys(IDL_INDEX.getSyntaxProblems()));

    // clean up this process and children
    await IDL_INDEX.cleanUp();
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: [IDL_TRANSLATION.lsp.index.failedIndexWorkspace, err],
      alert: IDL_TRANSLATION.lsp.index.failedIndexWorkspace,
    });
  }
});
