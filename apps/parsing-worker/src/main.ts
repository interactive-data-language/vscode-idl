import { IDL_WORKER_THREAD_CONSOLE, LogManager } from '@idl/logger';
import { ParseFileSync } from '@idl/parser';
import {
  ChangeDetection,
  IDL_INDEX_OPTIONS,
  IDLIndex,
  ReduceGlobals,
} from '@idl/parsing/index';
import { RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ChangeDetectionResponse,
  ILSPWorkerThreadClient,
  LSP_WORKER_THREAD_MESSAGE_LOOKUP,
  LSPWorkerThreadMessage,
  ParseFilesFastResponse,
  ParseFilesResponse,
  PostProcessFilesResponse,
  RemoveFilesResponse,
} from '@idl/workers/parsing';
import { WorkerIOClient } from '@idl/workers/workerio';
import { existsSync, readFileSync } from 'fs';
import { parentPort } from 'worker_threads';

// create our connection client - overload MessagePort to assert that we are running in a worker thread
const client = new WorkerIOClient<LSPWorkerThreadMessage>(
  parentPort,
  1
) as ILSPWorkerThreadClient<LSPWorkerThreadMessage>;

// send all logs to the parent process
console.log = (...args: any[]) => {
  client.log(args);
};
console.warn = (...args: any[]) => {
  client.log(args);
};
console.error = (...args: any[]) => {
  client.log(args);
};

// update settings for the thread
IDL_INDEX_OPTIONS.IS_MAIN_THREAD = false;

/**
 * Log manager for our worker thread
 */
const WORKER_THREAD_LOG_MANAGER = new LogManager({
  alert: () => {
    // do nothing
  },
});

/**
 * Intercept logs and send them to our parent process
 */
WORKER_THREAD_LOG_MANAGER.interceptor = (options) => {
  client.postMessage(LSP_WORKER_THREAD_MESSAGE_LOOKUP.LOG_MANAGER, options);
};

/**
 * Create our single-threaded worker index
 */
const WORKER_INDEX = new IDLIndex(WORKER_THREAD_LOG_MANAGER, 0, false);

/**
 * Handle requests to track our managed files
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.ALL_FILES, async (message) => {
  WORKER_INDEX.trackFiles(message.files);
});

/**
 * Handle requests to load globals from our IDL docs
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.LOAD_GLOBAL, async (message) => {
  WORKER_INDEX.loadGlobalTokens(message.config);
});

/**
 * Update our index with global tokens from other threads
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.TRACK_GLOBAL, async (message) => {
  const files = Object.keys(message);
  for (let i = 0; i < files.length; i++) {
    WORKER_INDEX.globalIndex.trackGlobalTokens(
      ReduceGlobals(message[files[i]]),
      files[i]
    );
  }
});

/**
 * Handle change detection
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.CHANGE_DETECTION,
  async (message) => {
    // run change detection!
    const changed = ChangeDetection(WORKER_INDEX, message.changed);

    // get syntax problems
    const problems = WORKER_INDEX.getSyntaxProblems();

    // problems by files we post processed
    const problemsByFile: ChangeDetectionResponse = {
      problems: {},
      missing: changed.missing,
    };

    // populate
    for (let i = 0; i < changed.changed.length; i++) {
      problemsByFile.problems[changed.changed[i]] =
        problems[changed.changed[i]] || [];
    }

    // return to our parent process
    return problemsByFile;
  }
);

/**
 * Get auto complete for files we manage
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_AUTO_COMPLETE,
  async (message) => {
    return await WORKER_INDEX.getAutoComplete(
      message.file,
      message.code,
      message.position,
      message.config
    );
  }
);

/**
 * Get outline
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_OUTLINE, async (message) => {
  return await WORKER_INDEX.getOutline(message.file, message.code);
});

/**
 * Get semantic tokens
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_SEMANTIC_TOKENS,
  async (message) => {
    return WORKER_INDEX.getSemanticTokens(message.file, message.code);
  }
);

/**
 * Get token definition for code that we manage
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_TOKEN_DEF, async (message) => {
  return WORKER_INDEX.getTokenDef(message.file, message.code, message.position);
});

/**
 * Handle requests to parse and post process a file
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILE, async (message) => {
  // index the file
  const parsed = await WORKER_INDEX.getParsedProCode(
    message.file,
    readFileSync(message.file, 'utf-8'),
    message.postProcess
  );

  // make non-circular
  RemoveScopeDetail(parsed);

  // return
  return parsed;
});

/**
 * Handle requests to parse and post process code for a file
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_CODE, async (message) => {
  // index the file
  const parsed = await WORKER_INDEX.getParsedProCode(
    message.file,
    message.code,
    message.postProcess
  );

  // make non-circular
  RemoveScopeDetail(parsed);

  // return
  return parsed;
});

/**
 * Parse files quickly to get the basic overview and thats it
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILES_FAST,
  async (message) => {
    /** Get files to process */
    const files = message.files;

    // craft our response
    const resp: ParseFilesFastResponse = {
      globals: {},
      problems: {},
      missing: [],
      lines: 0,
    };

    // populate response
    for (let i = 0; i < files.length; i++) {
      if (global.gc) {
        if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
          global.gc();
        }
      }

      try {
        /**
         * Parse our file
         */
        const parsed = ParseFileSync(files[i], false);

        // track syntax problems
        WORKER_INDEX.trackSyntaxProblemsForFile(files[i], parsed.parseProblems);

        // save global tokens
        await WORKER_INDEX.saveGlobalTokens(files[i], parsed.global);

        // save lines
        resp.lines += parsed.lines;

        // track globals
        resp.globals[files[i]] = parsed.global;

        // track parsing syntax errors
        resp.problems[files[i]] = parsed.parseProblems;
      } catch (err) {
        // check if we have a "false" error because a file was deleted
        if (!existsSync(files[i])) {
          resp.missing.push(files[i]);
          WORKER_INDEX.log.log({
            log: IDL_WORKER_THREAD_CONSOLE,
            type: 'warn',
            content: [
              `File was deleted, but we were not alerted before indexing files`,
              files[i],
              err,
            ],
          });
        } else {
          WORKER_INDEX.log.log({
            log: IDL_WORKER_THREAD_CONSOLE,
            type: 'error',
            content: [
              `Error while indexing files (likely from worker thread):`,
              err,
            ],
            alert: IDL_TRANSLATION.lsp.index.failedPostProcess,
          });
        }
      }
    }

    return resp;
  }
);

/**
 * Process some files
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILES, async (message) => {
  /** Get files to process */
  const files = message.files;

  // index files without post-processing
  const missing = await WORKER_INDEX.indexProFiles(files, false);

  // craft our response
  const resp: ParseFilesResponse = {
    globals: {},
    missing,
    lines: 0,
  };

  // populate response
  for (let i = 0; i < files.length; i++) {
    /**
     * Skip if we dont have a file. Could happen from parsing errors
     */
    if (!(files[i] in WORKER_INDEX.tokensByFile)) {
      continue;
    }

    // save lines
    resp.lines += WORKER_INDEX.tokensByFile[files[i]].lines;

    // track globals
    resp.globals[files[i]] = WORKER_INDEX.getGlobalsForFile(files[i]);
  }

  return resp;
});

/**
 * Post-process some files
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.POST_PROCESS_FILES,
  async (message) => {
    /** Get files */
    const files = Array.isArray(message.files)
      ? message.files
      : Object.keys(WORKER_INDEX.tokensByFile);

    // post process, no change detection
    const missing = await WORKER_INDEX.postProcessProFiles(files, false);

    // get syntax problems
    const problems = WORKER_INDEX.getSyntaxProblems();

    // craft our response
    const resp: PostProcessFilesResponse = {
      problems: {},
      missing,
      lines: 0,
    };

    // populate response
    for (let i = 0; i < files.length; i++) {
      /**
       * Skip if we dont have a file. Could happen from parsing errors
       */
      if (!(files[i] in WORKER_INDEX.tokensByFile)) {
        continue;
      }

      // save lines
      resp.lines += WORKER_INDEX.tokensByFile[files[i]].lines;

      // populate problems
      resp.problems[files[i]] = problems[files[i]] || [];
    }

    return resp;
  }
);

/**
 * Remove files and post-process every file that we manage to effectively perform change detection
 *
 * TODO: Correctly perform change detection from removing files instead of processing everything
 * we have which is brute force but works
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.REMOVE_FILES, async (message) => {
  // remove all files
  await WORKER_INDEX.removeWorkspaceFiles(message.files, false);

  /** Get files that we manage */
  const ourFiles = Object.keys(WORKER_INDEX.tokensByFile);

  // post process all of our files again
  const missing = await WORKER_INDEX.postProcessProFiles(ourFiles, false);

  // get syntax problems
  const problems = WORKER_INDEX.getSyntaxProblems();

  // craft our response
  const resp: RemoveFilesResponse = {
    problems: {},
    missing,
  };

  // populate response
  for (let i = 0; i < ourFiles.length; i++) {
    /**
     * Skip if we dont have a file. Could happen from parsing errors
     */
    if (!(ourFiles[i] in WORKER_INDEX.tokensByFile)) {
      continue;
    }

    // populate problems
    resp.problems[ourFiles[i]] = problems[ourFiles[i]] || [];
  }

  return resp;
});

/**
 * Listen for events from our main thread
 */
client.listen();
