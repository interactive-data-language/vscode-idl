import { AssembleWithIndex } from '@idl/assembler';
import { Migrator } from '@idl/assembling/migrators';
import {
  GenerateENVITask,
  GenerateENVITaskMainLevelProgram,
} from '@idl/generators/envi-task';
import {
  GenerateIDLTask,
  GenerateIDLTaskMainLevelProgram,
} from '@idl/generators/idl-task';
import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { IDL_WORKER_THREAD_CONSOLE, LogManager } from '@idl/logger';
import { PrepareNotebookCell } from '@idl/notebooks/idl-index';
import { ParseFileSync } from '@idl/parser';
import {
  ChangeDetectionWorkerThread,
  GetCompletionRecipes,
  GetHoverHelpLookup,
  GetParsedPROCode,
  GetSyntaxProblems,
  IDL_INDEX_OPTIONS,
  IDLIndex,
  ReduceGlobals,
} from '@idl/parsing/index';
import {
  IParsedLightWeight,
  RemoveScopeDetail,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ChangeDetectionResponse,
  ILSPWorkerThreadClient,
  LSP_WORKER_THREAD_MESSAGE_LOOKUP,
  LSPWorkerThreadMessage,
  ParseFilesFastResponse,
  ParseFilesResponse,
  ParseNotebookResponse,
  PostProcessFilesResponse,
  RemoveFilesResponse,
} from '@idl/workers/parsing';
import { WorkerIOClient } from '@idl/workers/workerio';
import { existsSync } from 'fs';
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
WORKER_THREAD_LOG_MANAGER.setInterceptor((options) => {
  client.postMessage(LSP_WORKER_THREAD_MESSAGE_LOOKUP.LOG_MANAGER, options);
});

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
 * Format files
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.ASSEMBLE_PRO_CODE,
  async (message, cancel) => {
    return AssembleWithIndex(
      WORKER_INDEX,
      message.file,
      message.code,
      cancel,
      message.formatting
    );
  }
);

/**
 * Handle requests to load globals from our IDL docs
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.LOAD_GLOBAL, async (message) => {
  WORKER_INDEX.loadGlobalTokens(message.config);
});

/**
 * Migrate files
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.MIGRATE_CODE,
  async (message, cancel) => {
    // index the file
    const parsed = await GetParsedPROCode(
      WORKER_INDEX,
      message.file,
      message.code,
      cancel
    );

    // migrate and return
    return Migrator(message.migrationType, parsed, message.formatting, cancel);
  }
);

/**
 * Update our index with global tokens from other threads
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.TRACK_GLOBAL, async (message) => {
  const files = Object.keys(message);
  for (let i = 0; i < files.length; i++) {
    /**
     * Ignore files that we have parsed
     *
     * We need to have the same object references for global tokens
     * and the parsed data structure so thats why we skip this
     *
     * Not to mention we update these locally on post-processing so
     * we dont need it from everyone
     */
    if (WORKER_INDEX.parsedCache.has(files[i])) {
      continue;
    }

    // save as known file
    WORKER_INDEX.knownFiles[files[i]] = undefined;

    // update global tokens we track
    WORKER_INDEX.globalIndex.trackGlobalTokens(
      ReduceGlobals(message[files[i]]),
      files[i]
    );
  }
});

/**
 * Handle requests to parse and post process code for a file
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.AUTO_COMPLETE_RECIPE,
  async (message, cancel) => {
    return GetCompletionRecipes(
      WORKER_INDEX,
      message.file,
      message.code,
      message.position
    );
  }
);

/**
 * Handle change detection
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.CHANGE_DETECTION,
  async (message, cancel) => {
    // run change detection!
    const changed = await ChangeDetectionWorkerThread(
      WORKER_INDEX,
      cancel,
      message.changed
    );

    // get syntax problems
    const problems = WORKER_INDEX.getSyntaxProblems();

    // problems by files we post processed
    const problemsByFile: ChangeDetectionResponse = {
      problems: {},
      missing: changed.missing,
      globals: changed.globals,
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
 * Clean up and return memory usage
 */
client.on(LSP_WORKER_THREAD_MESSAGE_LOOKUP.CLEAN_UP, async (message) => {
  /**
   * Don't clean up parsed cache - otherwise change detection doesnt work
   */
  // await WORKER_INDEX.clearParsedCache(message?.all);

  // run GC
  await WORKER_INDEX.cleanUp();
});

/**
 * Handle requests to make a task file
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GENERATE_TASK,
  async (message, cancel) => {
    // index the file
    const parsed = await GetParsedPROCode(
      WORKER_INDEX,
      message.fsPath,
      message.code,
      cancel,
      {
        postProcess: true,
      }
    );

    /**
     * Do we write to disk or not?
     */
    const WRITE_TASK = true;

    /**
     * Make our task
     */
    const result =
      message.type === 'envi'
        ? await GenerateENVITask(
            message.fsPath,
            parsed,
            message.config,
            WRITE_TASK
          )
        : await GenerateIDLTask(
            message.fsPath,
            parsed,
            message.config,
            WRITE_TASK
          );

    /** Return value for PRO code */
    let proCode: string;

    // if we made a task, then make PRO code
    if (result.success) {
      // check of we have a main level program
      if (parsed.tree[parsed.tree.length - 1].name !== TOKEN_NAMES.MAIN_LEVEL) {
        const mainAdd =
          message.type === 'envi'
            ? GenerateENVITaskMainLevelProgram(
                result as GenerateTaskResult<true>
              )
            : GenerateIDLTaskMainLevelProgram(
                result as GenerateTaskResult<true>
              );

        // make new text
        proCode = message.code + '\n' + mainAdd;
      }
    }

    // return
    return {
      result,
      proCode,
    };
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
 * Get lookup (recipe) for hover help
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_HOVER_HELP_LOOKUP,
  async (message) => {
    return GetHoverHelpLookup(
      WORKER_INDEX,
      message.file,
      message.code,
      message.position
    );
  }
);

/**
 * Get outline
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_OUTLINE,
  async (message, cancel) => {
    return await WORKER_INDEX.getOutline(message.file, message.code, cancel);
  }
);

/**
 * Get semantic tokens
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_SEMANTIC_TOKENS,
  async (message, cancel) => {
    return WORKER_INDEX.getSemanticTokens(message.file, message.code, cancel);
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
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILE,
  async (message, cancel) => {
    // index the file
    const parsed = await GetParsedPROCode(
      WORKER_INDEX,
      message.file,
      WORKER_INDEX.getFileStrings(message.file),
      cancel,
      message
    );

    const lightParsed: IParsedLightWeight = {
      disabledProblems: parsed.disabledProblems,
      global: parsed.global,
      parseProblems: parsed.parseProblems,
      postProcessProblems: parsed.postProcessProblems,
    };

    // return
    return lightParsed;
  }
);

/**
 * Handle requests to parse and post process code for a file
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_CODE,
  async (message, cancel) => {
    // index the file

    const parsed = await GetParsedPROCode(
      WORKER_INDEX,
      message.file,
      message.code,
      cancel,
      message
    );

    // make non-circular
    RemoveScopeDetail(parsed, cancel, true);

    const lightParsed: IParsedLightWeight = {
      disabledProblems: parsed.disabledProblems,
      global: parsed.global,
      parseProblems: parsed.parseProblems,
      postProcessProblems: parsed.postProcessProblems,
    };

    // return
    return lightParsed;
  }
);

/**
 * Parse files quickly to get the basic overview and thats it
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILES_FAST,
  async (message, cancel) => {
    /** Get files to process */
    const files = message.files;

    // craft our response
    const resp: ParseFilesFastResponse = {
      globals: {},
      disabledProblems: {},
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
        const parsed = ParseFileSync(files[i], cancel, { full: false });

        // track syntax problems
        WORKER_INDEX.trackSyntaxProblemsForFile(files[i], parsed.parseProblems);

        // save global tokens
        await WORKER_INDEX.saveGlobalTokens(
          parsed.global,
          files[i],
          parsed.disabledProblems
        );

        // save lines
        resp.lines += parsed.lines;

        // track globals
        resp.globals[files[i]] = parsed.global;

        // track parsing syntax errors
        resp.problems[files[i]] = parsed.parseProblems;
      } catch (err) {
        // check if we have a "false" error because a file was deleted
        if (!existsSync(files[i]) && !files[i].includes('#')) {
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
            alert: IDL_TRANSLATION.lsp.index.failedIndexWorkspace,
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
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILES,
  async (message, cancel) => {
    /** Get files to process */
    const files = message.files;

    // index files without post-processing
    const missing = await WORKER_INDEX.indexProFiles(files, cancel, false);

    // craft our response
    const resp: ParseFilesResponse = {
      globals: {},
      disabledProblems: {},
      missing,
      lines: 0,
    };

    // populate response
    for (let i = 0; i < files.length; i++) {
      if (global.gc) {
        if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
          global.gc();
        }
      }

      /**
       * Skip if we dont have a file. Could happen from parsing errors
       */
      if (!WORKER_INDEX.parsedCache.has(files[i])) {
        continue;
      }

      // save lines
      resp.lines += WORKER_INDEX.parsedCache.lines(files[i]);

      // track globals
      resp.globals[files[i]] = WORKER_INDEX.getGlobalsForFile(files[i]);

      // track disabled
      resp.disabledProblems[files[i]] =
        WORKER_INDEX.parsedCache.disabledProblems(files[i]);
    }

    return resp;
  }
);

/**
 * Parse notebooks
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_NOTEBOOK,
  async (message, cancel) => {
    /**
     * Initialize our response
     */
    const resp: ParseNotebookResponse = {
      lines: 0,
      globals: {},
      problems: {},
    };

    /**
     * Index our notebook
     */
    const byCell = await WORKER_INDEX.getParsedNotebook(
      message.file,
      message.notebook,
      cancel
    );

    /**
     * Get files for cells that we actually processed
     */
    const files = Object.keys(byCell);

    // process each cell and save information we need to return
    for (let i = 0; i < files.length; i++) {
      if (byCell[files[i]] === undefined) {
        resp.globals[files[i]] = [];
        resp.problems[files[i]] = [];
        continue;
      }
      resp.globals[files[i]] = byCell[files[i]].global;
      resp.problems[files[i]] = GetSyntaxProblems(byCell[files[i]]);
    }

    // return each cell
    return resp;
  }
);

/**
 * Get notebook cells
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_NOTEBOOK_CELL,
  async (message, cancel) => {
    // get parsed code and return
    const parsed = await GetParsedPROCode(
      WORKER_INDEX,
      message.file,
      message.code,
      cancel
    );

    const lightParsed: IParsedLightWeight = {
      disabledProblems: parsed.disabledProblems,
      global: parsed.global,
      parseProblems: parsed.parseProblems,
      postProcessProblems: parsed.postProcessProblems,
    };
    return lightParsed;
  }
);

/**
 * Post-process some files
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.POST_PROCESS_FILES,
  async (message, cancel) => {
    /** Get files */
    const files = Array.isArray(message.files)
      ? message.files
      : WORKER_INDEX.parsedCache.allFiles();

    // post process, no change detection
    const postProcess = await WORKER_INDEX.postProcessProFiles(
      files,
      cancel,
      false
    );

    // get syntax problems
    const problems = WORKER_INDEX.getSyntaxProblems();

    // craft our response
    const resp: PostProcessFilesResponse = {
      problems: {},
      missing: postProcess.missing,
      globals: postProcess.globals,
      lines: 0,
    };

    // populate response
    for (let i = 0; i < files.length; i++) {
      if (global.gc) {
        if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
          global.gc();
        }
      }

      /**
       * Skip if we dont have a file. Could happen from parsing errors
       */
      if (!WORKER_INDEX.parsedCache.has(files[i])) {
        continue;
      }

      // save lines
      resp.lines += WORKER_INDEX.parsedCache.lines(files[i]);

      // populate problems
      resp.problems[files[i]] = problems[files[i]] || [];
    }

    return resp;
  }
);

/**
 * Prepare a notebook cell to run
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.PREPARE_NOTEBOOK_CELL,
  async (message, cancel) => {
    /**
     * Get parsed code
     */
    const parsed = await WORKER_INDEX.getParsedNotebookCell(
      message.cellUri,
      message.code,
      cancel
    );

    // prepare and return
    return PrepareNotebookCell(parsed, message.code);
  }
);

/**
 * Remove files and post-process every file that we manage to effectively perform change detection
 *
 * TODO: Correctly perform change detection from removing files instead of processing everything
 * we have which is brute force but works
 */
client.on(
  LSP_WORKER_THREAD_MESSAGE_LOOKUP.REMOVE_FILES,
  async (message, cancel) => {
    // remove all files
    await WORKER_INDEX.removeWorkspaceFiles(message.files, false);

    /** Get files that we manage */
    const ourFiles = WORKER_INDEX.parsedCache.allFiles();

    // post process all of our files again
    const postProcess = await WORKER_INDEX.postProcessProFiles(
      ourFiles,
      cancel,
      false
    );

    // get syntax problems
    const problems = WORKER_INDEX.getSyntaxProblems();

    // craft our response
    const resp: RemoveFilesResponse = {
      problems: {},
      missing: postProcess.missing,
    };

    // populate response
    for (let i = 0; i < ourFiles.length; i++) {
      if (global.gc) {
        if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
          global.gc();
        }
      }

      /**
       * Skip if we dont have a file. Could happen from parsing errors
       */
      if (!WORKER_INDEX.parsedCache.has(ourFiles[i])) {
        continue;
      }

      // populate problems
      resp.problems[ourFiles[i]] = problems[ourFiles[i]] || [];
    }

    return resp;
  }
);

/**
 * Listen for events from our main thread
 */
client.listen();
