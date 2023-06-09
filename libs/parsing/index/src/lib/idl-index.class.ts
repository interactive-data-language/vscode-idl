import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import {
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GlobalTokens,
  GlobalTokenType,
} from '@idl/data-types/core';
import { TaskToGlobalToken } from '@idl/data-types/tasks';
import {
  IDL_LSP_LOG,
  IDL_WORKER_THREAD_CONSOLE,
  LogManager,
} from '@idl/logger';
import { CodeChecksum, Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { GetSemanticTokens } from '@idl/parsing/semantic-tokens';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { IncludeToken } from '@idl/parsing/tokenizer';
import { LoadConfig } from '@idl/schemas/idl.json';
import { LoadTask } from '@idl/schemas/tasks';
import {
  CONFIG_FILE_GLOB_PATTERN,
  IDL_FILE_EXTENSION,
  LANGUAGE_SERVER_CONFIG_URI,
  NODE_MEMORY_CONFIG,
  PRO_CODE_GLOB_PATTERN,
  SAVE_FILE_GLOB_PATTERN,
  TASK_FILE_EXTENSION,
  TASK_FILE_GLOB_PATTERN,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDLExtensionConfig,
} from '@idl/vscode/extension-config';
import {
  ChangeDetectionResponse,
  GetAutoCompleteResponse,
  GetSemanticTokensResponse,
  GetTokenDefResponse,
  ILSPWorkerThreadPool,
  LoadGlobalResponse,
  LSP_WORKER_THREAD_MESSAGE_LOOKUP,
  LSPWorkerThreadMessage,
  ParseFilesFastResponse,
  ParseFilesResponse,
  PostProcessFilesResponse,
  RemoveFilesResponse,
  TrackGlobalTokensPayload,
  TrackGlobalTokensResponse,
} from '@idl/workers/parsing';
import { WorkerIOPool } from '@idl/workers/workerio';
import { deepEqual } from 'fast-equals';
import * as glob from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import { cpus, platform } from 'os';
import { basename, dirname, join } from 'path';
import { DocumentSymbol, Position } from 'vscode-languageserver/node';
import { Worker } from 'worker_threads';

import { GetAutoComplete } from './auto-complete/get-auto-complete';
import { CanChangeDetection } from './change-detection/can-change-detection';
import { ChangeDetection } from './change-detection/change-detection';
import { GlobalIndex } from './global-index.class';
import { GetSyntaxProblems } from './helpers/get-syntax-problems';
import { ResetGlobalDisplayNames } from './helpers/reset-global-display-names';
import { SplitFiles } from './helpers/split-files';
import { GetHoverHelp } from './hover-help/get-hover-help';
import {
  IDL_INDEX_OPTIONS,
  IDLFileTypeLookup,
  IFolderRecursion,
} from './idl-index.interface';
import { IDL_GLOBAL_TOKENS, LoadGlobal } from './load-global/load-global';
import { OutlineDisplayName } from './outline';
import {
  DEFAULT_OUTLINE_SYMBOL_KIND,
  OUTLINE_THESE_TOKENS,
  OUTLINE_TOKEN_KIND_MAP,
} from './outline.interface';
import { PostProcessParsed } from './post-process/post-process-parsed';
import { GetTokenDefinition } from './token-definiton/get-token-definition';

/**
 * Auto-pick the number of workers. On higher-end machines, doesn't
 * change much over 4 workers.
 */
export const NUM_WORKERS = Math.min(Math.max(cpus().length / 2, 1), 6);

/**
 * Class that manages the creation of an index from all IDL code
 */
export class IDLIndex {
  /**
   * Global token index and searching tool
   */
  globalIndex = new GlobalIndex();

  /**
   * Our worker pool to share the load of parsing code
   */
  private indexerPool: ILSPWorkerThreadPool<LSPWorkerThreadMessage>;

  /**
   * NUmber of workers that we populate our indexer pool with
   */
  private nWorkers: number;

  /**
   * Class for logging nicely formatted text to the console and/or files
   */
  log: LogManager;

  /**
   * Track syntax problems by file from what we parse
   */
  private syntaxProblemsByFile: { [key: string]: SyntaxProblems } = {};

  /**
   * All of the files that we are aware of. Either we have processed them
   * or found them and they came to us in a message from our parent process
   */
  knownFiles: { [key: string]: undefined } = {};

  /**
   * The types of files that we have
   */
  fileTypes: IDLFileTypeLookup = {
    pro: new Set(),
    save: new Set(),
    'idl.json': new Set(),
    'idl-task': new Set(),
    'envi-task': new Set(),
  };

  /**
   * Track tokens for each file that we process
   */
  tokensByFile: { [key: string]: IParsed } = {};

  /**
   * Track files that we are currently processing so that we can't accidentally
   * re-process files that we are already processing
   */
  pendingFiles: { [key: string]: Promise<IParsed> } = {};

  /**
   * Track the workers that own each file
   *
   * If the value is `undefined`, then the file was processed in our thread
   */
  workerIDsByFile: { [key: string]: string | undefined } = {};

  /**
   * Track config file for each folder that has one
   */
  private configByFolder: { [key: string]: IAssemblerOptions<FormatterType> } =
    {};

  /**
   * Track changed files that we need to sync problems for regarding
   * global tokens (i.e. duplicate problems)
   */
  changedFiles: { [key: string]: boolean } = {};

  /**
   * Statistics from the last time we parsed a workspace
   */
  lastWorkspaceIndexStats: {
    /** Did we start the server and index a workspace */
    haveStats: boolean;
    /** Number of files */
    files: number;
    /** In ms */
    time: number;
    /** Of code */
    lines: number;
  } = {
    haveStats: false,
    time: 0,
    files: 0,
    lines: 0,
  };

  constructor(log: LogManager, nWorkers = NUM_WORKERS, loadCache = true) {
    // force the number of workers to be 0 is we are not the main thread
    if (!IDL_INDEX_OPTIONS.IS_MAIN_THREAD) {
      nWorkers = 0;
    }

    this.log = log;
    this.nWorkers = nWorkers;

    // only print if we have stuff to do
    if (nWorkers > 0) {
      this.log.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Creating parser worker thread pool with ${nWorkers} workers`,
      });
    }

    // reset display names
    ResetGlobalDisplayNames();

    // catalog our global routines
    if (loadCache) {
      LoadGlobal();
      this.globalIndex.trackGlobalTokens(IDL_GLOBAL_TOKENS);
    }

    // initialize workers
    const workers: Worker[] = [];

    // create all of our workers
    for (let i = 0; i < nWorkers; i++) {
      workers.push(
        new Worker(join(dirname(__dirname), 'parsing-worker/main.js'), {
          resourceLimits: {
            maxOldGenerationSizeMb: NODE_MEMORY_CONFIG.OLD_WORKER,
            maxYoungGenerationSizeMb: NODE_MEMORY_CONFIG.YOUNG,
          },
        })
      );
    }

    // create our worker pool
    this.indexerPool = new WorkerIOPool(
      log,
      workers,
      IDL_TRANSLATION.lsp.events.unhandledWorkerMessage
    ) as ILSPWorkerThreadPool<LSPWorkerThreadMessage>;

    // subscribe to log messages
    if (this.nWorkers > 0) {
      this.indexerPool
        .subscribeToGlobalMessages(LSP_WORKER_THREAD_MESSAGE_LOOKUP.LOG_MANAGER)
        .subscribe((msg) => {
          this.log.log(msg);
        });
    }
  }

  /**
   * Returns a true/false flag if we are using worker threads for our indexing work.
   *
   * If the answer is false, then we do the work in this thread
   */
  isMultiThreaded() {
    return this.nWorkers > 0;
  }

  /**
   * Using our extension config, applies filtering for which global tokens
   * we can load.
   *
   * ONLY USE THIS IF NOT LOADING FROM CACHE IN INIT
   */
  loadGlobalTokens(config: IDLExtensionConfig) {
    const okToLoad: { [key: string]: any } = {};
    okToLoad[GLOBAL_TOKEN_SOURCE_LOOKUP.USER] = true;
    okToLoad[GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL] = true;

    // load from our preferences
    if (!config.developer.IDL) {
      okToLoad[GLOBAL_TOKEN_SOURCE_LOOKUP.IDL] = true;
    }
    if (!config.developer.ENVI) {
      okToLoad[GLOBAL_TOKEN_SOURCE_LOOKUP.ENVI] = true;
    }
    if (!config.developer.ENVIDeepLearning) {
      okToLoad[GLOBAL_TOKEN_SOURCE_LOOKUP.ENVI_DL] = true;
    }
    if (!config.developer.ENVIMachineLearning) {
      okToLoad[GLOBAL_TOKEN_SOURCE_LOOKUP.ENVI_ML] = true;
    }

    // load tokens using our filter
    LoadGlobal(okToLoad);

    // reset the global display names that we have loaded
    ResetGlobalDisplayNames();

    // load global tokens, with a filter applied
    this.globalIndex.trackGlobalTokens(IDL_GLOBAL_TOKENS);

    // send messages to all of our worker children if we have them
    if (this.nWorkers > 0) {
      this.indexerPool.postToAll(LSP_WORKER_THREAD_MESSAGE_LOOKUP.LOAD_GLOBAL, {
        config,
      });
    }
  }

  /**
   * Indicates if we have a file that we can process for tokens (PRO code).
   *
   * This is needed because we have other files that we watch as well.
   */
  isPROCode(file: string): boolean {
    return file.toLowerCase().endsWith(IDL_FILE_EXTENSION);
  }

  /**
   * Indicates that a file is a configuration file
   */
  isConfigFile(file: string): boolean {
    return file.toLowerCase().endsWith(LANGUAGE_SERVER_CONFIG_URI);
  }

  /**
   * Indicates that a file is a task file (IDL, ENVI, etc.)
   */
  isTaskFile(file: string): boolean {
    return file.toLowerCase().endsWith(TASK_FILE_EXTENSION);
  }

  /**
   * Given an include token, we attempt to resolve which file that we know
   * matches the include file.
   *
   * If no file is found, returns a null string.
   */
  resolveInclude(token: TreeToken<IncludeToken>) {
    /**
     * Get the include file we need to find
     */
    let match = token.match[1].toLowerCase();

    // make sure it ends with ".pro"
    if (!match.endsWith('.pro')) {
      match += '.pro';
    }

    /**
     * Get all files we have
     */
    const files = Object.keys(this.knownFiles);

    /** Init variable for our found file */
    let foundFile = '';

    // track down our include
    for (let i = 0; i < files.length; i++) {
      // skip if not PRO file
      if (!this.isPROCode(files[i])) {
        continue;
      }

      if (basename(files[i]).toLowerCase() === match) {
        foundFile = files[i];
      }
    }

    return foundFile;
  }

  /**
   * Return syntax problems from parsing IDL code, by file
   *
   * If the value in the key is undefined, use the tokensByFile result
   * which means the file is stored locally
   */
  getSyntaxProblems() {
    return this.syntaxProblemsByFile;
  }

  /**
   * Return syntax problems from duplicate global tokens
   */
  getGlobalTokenSyntaxProblems() {
    return this.globalIndex.globalSyntaxProblemsByFile;
  }

  /**
   * Updates the logger that we use
   */
  setLog(newLog: LogManager) {
    this.log = newLog;
    this.indexerPool.setLog(newLog);
  }

  /**
   * Destroys our object and cleans up any workers that we have created
   */
  destroy() {
    this.indexerPool.destroy();
    // this.globalIndex.destroy();
    // this.sub.unsubscribe();
  }

  /**
   * Retrieves hover help for the specified file at the selected
   * location
   */
  async getHoverHelp(
    file: string,
    code: string | string[],
    position: Position,
    config: IDLExtensionConfig = DEFAULT_IDL_EXTENSION_CONFIG
  ) {
    return GetHoverHelp(this, file, code, position, config);
  }

  /**
   * Retrieves auto-complete items given a file and location
   */
  async getAutoComplete(
    file: string,
    code: string | string[],
    position: Position,
    config: IDLExtensionConfig = DEFAULT_IDL_EXTENSION_CONFIG,
    formatting: IAssemblerOptions<FormatterType> = DEFAULT_ASSEMBLER_OPTIONS
  ): Promise<GetAutoCompleteResponse> {
    return GetAutoComplete(this, file, code, position, config, formatting);
  }

  /**
   * Gets semantic tokens for a file
   */
  async getSemanticTokens(
    file: string,
    code: string | string[]
  ): Promise<GetSemanticTokensResponse> {
    // if we are multi threaded, then
    if (this.isMultiThreaded()) {
      return await this.indexerPool.workerio.postAndReceiveMessage(
        this.getWorkerID(file),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_SEMANTIC_TOKENS,
        { file, code }
      );
    } else {
      return GetSemanticTokens(await this.getParsedProCode(file, code, true));
    }
  }

  /**
   * Returns the location of where a selected token is located
   */
  async getTokenDef(
    file: string,
    code: string | string[],
    position: Position
  ): Promise<GetTokenDefResponse> {
    return GetTokenDefinition(this, file, code, position);
  }

  /**
   * Before adding new syntax problems for a file, remove the ones that
   * we currently have in case they were fixed or there are different ones
   */
  private removeSyntaxProblemsByFile(file: string) {
    delete this.syntaxProblemsByFile[file];
  }

  /**
   * Tracks syntax problems for a file.
   *
   * Internally, marks a file as "changed" which indicates that we need to
   * send syntax problems for it the next time we sync problems.
   */
  trackSyntaxProblemsForFile(file: string, problems: SyntaxProblems) {
    /**
     * If we are already tracking our file, see if the problem have changed
     * before we track it
     */
    if (file in this.syntaxProblemsByFile) {
      if (deepEqual(problems, this.syntaxProblemsByFile[file])) {
        return;
      }
    }
    this.changedFiles[file] = true;
    this.syntaxProblemsByFile[file] = problems;
  }

  /**
   * Find global tokens with with the specified name
   */
  findMatchingGlobalToken<T extends GlobalTokenType>(type: T, name: string) {
    return this.globalIndex.findMatchingGlobalToken<T>(type, name);
  }

  // /**
  //  * Search our global index for the location of a global token
  //  */
  // searchGlobalTokens<T extends GlobalTokenType>(type: T, searchFor: string) {
  //   return this.globalIndex.searchGlobalTokens<T>(type, searchFor);
  // }

  /**
   * Sync global tokens with all other
   */
  private async syncGlobal(file: string, globals: GlobalTokens) {
    if (this.isMultiThreaded()) {
      // make our payload
      const msg: TrackGlobalTokensPayload = {};
      msg[file] = globals;

      /** Worker ID associated with file */
      const id = this.getWorkerID(file);

      /** Get all ids to send to */
      const ids = this.indexerPool.getIDs();

      // track promises to process request
      const proms: Promise<TrackGlobalTokensResponse>[] = [];

      // process each ID
      for (let i = 0; i < ids.length; i++) {
        // if from our file owner, skip as it has globals
        if (ids[i] === id) {
          continue;
        }

        // sync to everywhere else
        proms.push(
          this.indexerPool.workerio.postAndReceiveMessage(
            ids[i],
            LSP_WORKER_THREAD_MESSAGE_LOOKUP.TRACK_GLOBAL,
            msg
          )
        );
      }

      // wait for all workers to finish
      await Promise.all(proms);
    }
  }

  /**
   * Indexes global symbols
   */
  async saveGlobalTokens(file: string, global: GlobalTokens) {
    this.globalIndex.trackGlobalTokens(global, file);
    await this.syncGlobal(file, global);
  }

  /**
   * Returns the outline of global tokens for the given file.
   *
   * If the tokens don't exist, and we have PRO code, then we will extract
   * tokens prior to showing the outline.
   *
   * There may be some race conditions for tokens/outlines here.
   */
  async getOutline(
    file: string,
    code: string | string[]
  ): Promise<DocumentSymbol[]> {
    // if document isnt PRO code, return
    if (!this.isPROCode(file)) {
      return undefined;
    }

    // if we are multi threaded, then
    if (this.isMultiThreaded()) {
      return await this.indexerPool.workerio.postAndReceiveMessage(
        this.getWorkerID(file),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_OUTLINE,
        { file, code }
      );
    }

    // get tokens for our file
    const tokens = await this.getParsedProCode(file, code, true);

    // get our global tokens
    const global = tokens.global;

    // initialize object to track global tokens
    // only track a single token per line which matches IDL where you cant declare
    // more than one routine on the same line
    const tracked: { [key: number]: DocumentSymbol } = {};

    // process our global tokens
    for (let i = 0; i < global.length; i++) {
      // extract global token
      const token = global[i];

      // check if we need to save
      if (token.type in OUTLINE_THESE_TOKENS) {
        tracked[token.pos[0]] = {
          kind:
            token.type in OUTLINE_TOKEN_KIND_MAP
              ? OUTLINE_TOKEN_KIND_MAP[token.type]
              : DEFAULT_OUTLINE_SYMBOL_KIND,
          name: OutlineDisplayName(token),
          range: {
            start: {
              line: token.pos[0],
              character: token.pos[1],
            },
            end: {
              line: token.pos[0],
              character: token.pos[1] + token.pos[2],
            },
          },
          selectionRange: {
            start: {
              line: token.pos[0],
              character: token.pos[1],
            },
            end: {
              line: token.pos[0],
              character: token.pos[1] + token.pos[2],
            },
          },
        };
      }
    }

    // order by appearance
    const lines = Object.keys(tracked).sort();
    const found: DocumentSymbol[] = [];
    for (let i = 0; i < lines.length; i++) {
      found.push(tracked[lines[i]]);
    }

    return found;
  }

  /**
   * Removes a file from the search index
   */
  async removeFile(file: string, changeDetection = false) {
    // clean up syntax problems
    this.removeSyntaxProblemsByFile(file);

    // remove globals
    const global = this.globalIndex.removeTokensForFile(file);

    // remove file from lookups
    delete this.tokensByFile[file];
    delete this.knownFiles[file];

    // check if we should do change detection because it has been removed
    if (changeDetection) {
      await this.changeDetection([], global);
    }

    // return removed globals
    return global;
  }

  /**
   * Removes many files from the index
   */
  private async removeFiles(files: string[], changeDetection = false) {
    for (let i = 0; i < files.length; i++) {
      await this.removeFile(files[i], changeDetection);
    }
  }

  /**
   * Index code for a potential pseudo file (one that might be unsaved or we have unsaved edits)
   */
  async removeConfigFile(file: string) {
    delete this.configByFolder[dirname(file)];
  }

  /**
   * Index config file
   */
  private async indexConfigFile(file: string, content?: string) {
    /**
     * We wrap in a try-catch block because we will have code failures if
     * a config file is invalid. This is not a true error though, but it
     * does get reported to the user vis messages to VSCode
     */
    try {
      this.fileTypes['idl.json'].add(file);
      this.knownFiles[file] = undefined;
      this.configByFolder[dirname(file)] = await LoadConfig(file, content);
    } catch (err) {
      this.log.log({
        log: IDL_LSP_LOG,
        type: 'error',
        content: [`${IDL_TRANSLATION.lsp.config.failedParse}: "${file}"`, err],
        alert: `${IDL_TRANSLATION.lsp.config.failedParse}: "${file}"`,
        alertMeta: {
          file,
        },
      });
    }
  }

  /**
   * Index  config files
   */
  private async indexConfigFiles(files: string[]) {
    // process all of our config files
    for (let i = 0; i < files.length; i++) {
      await this.indexConfigFile(files[i]);
    }

    // send to threads
    if (this.isMultiThreaded()) {
      this.indexerPool.postToAll(LSP_WORKER_THREAD_MESSAGE_LOOKUP.ALL_FILES, {
        files,
      });
    }
  }

  /**
   * Index task file
   */
  private async indexTaskFile(file: string, content?: string) {
    /**
     * Wrap parsing in try catch since we will eventually have task file errors
     */
    try {
      // load our task
      const task = await LoadTask(file, content);

      // convert to global tokens
      const global = TaskToGlobalToken(task);

      // save the file type
      if (global[0].name.startsWith('envi')) {
        this.fileTypes['envi-task'].add(file);
      } else {
        this.fileTypes['idl-task'].add(file);
      }

      // track and sync if needed
      this.saveGlobalTokens(file, global);

      // track as known file
      this.knownFiles[file] = undefined;
    } catch (err) {
      // this.log.log({
      //   log: IDL_LSP_LOG,
      //   type: 'error',
      //   content: [
      //     `${IDL_TRANSLATION.tasks.parsing.errors.failedParse}: "${file}"`,
      //     err,
      //   ],
      //   /**
      //    * Silently error for now, JSON errors should appear if they open the file
      //    */
      //   // alert: `${IDL_TRANSLATION.tasks.parsing.errors.failedParse}: "${file}"`,
      //   // alertMeta: {
      //   //   file,
      //   // },
      // });
    }
  }

  /**
   * Index more than one task file
   */
  private async indexTaskFiles(files: string[]) {
    // process all of our config files
    for (let i = 0; i < files.length; i++) {
      await this.indexTaskFile(files[i]);
    }

    // send to threads
    if (this.isMultiThreaded()) {
      this.indexerPool.postToAll(LSP_WORKER_THREAD_MESSAGE_LOOKUP.ALL_FILES, {
        files,
      });
    }
  }

  /**
   * Index task files within our workspace to create global tokens
   *
   * No validation at this point
   */
  private async indexWorkspaceTaskFiles(
    folder: string | string[] | IFolderRecursion
  ) {
    // find task files
    const files = await this.findFiles(folder, TASK_FILE_GLOB_PATTERN);

    // index files
    await this.indexTaskFiles(files);
  }

  /**
   * Index workspace configuration files and checks that the folders
   * we index have idl.json files and, if not, sends a message to our
   * extension client.
   */
  private async indexWorkspaceConfigFiles(
    folder: string | string[] | IFolderRecursion
  ) {
    // find config files for all of our folders
    const files = await this.findFiles(folder, CONFIG_FILE_GLOB_PATTERN);

    // index files
    await this.indexConfigFiles(files);

    /**
     * Check and see if we have folders that we need to alert the user
     * as missing a config file
     */

    // init folders
    let checkThese: string[] = [];

    // handle our input type
    switch (true) {
      case typeof folder === 'string':
        checkThese.push(folder as string);
        break;
      case Array.isArray(folder):
        checkThese = folder as string[];
        break;
      default:
        checkThese = Object.keys(folder as IFolderRecursion);
        break;
    }

    // check for a config file
    for (let i = 0; i < checkThese.length; i++) {
      // if (!existsSync(join(checkThese[i], 'idl.json'))) {
      //   this.log.log({
      //     log: IDL_LSP_LOG,
      //     type: 'info',
      //     // dont actually log, just need the alert for the user
      //     content: [],
      //     // message is set with translations at the client,where we craft a UI to ask
      //     alert: `No "idl.json" file found in folder "${checkThese[i]}", initialize?`,
      //     alertMeta: {
      //       initConfig: {
      //         folder: checkThese[i],
      //       },
      //     },
      //   });
      // }
    }
  }

  /**
   * Returns the formatting and configuration for a specific file
   */
  getConfigForFile(
    file: string,
    defaultConfig: IAssemblerOptions<FormatterType> = DEFAULT_ASSEMBLER_OPTIONS
  ) {
    /** Get folder name for file */
    const folder = dirname(file);

    // regex splitter to split folder by depth (length is not going to always be right)
    const regex = platform() === 'win32' ? /\\/gim : /\//gim;

    // get all the current folders we have stored
    const folders = Object.keys(this.configByFolder)
      .sort((a, b) => (a.split(regex).length < b.split(regex).length ? -1 : 1))
      .reverse();

    // search folders from longest to shortest path in case we have nested
    // configurations within sub directories
    for (let i = 0; i < folders.length; i++) {
      if (folder.includes(folders[i])) {
        return this.configByFolder[folders[i]];
      }
    }

    // return default assembler options if we dont have any matches above
    return defaultConfig;
  }

  /**
   * Gets the associated worked ID for a file that we are processing
   *
   * If the file has not been processed by a worker it is assigned an ID
   */
  getWorkerID(file: string) {
    if (this.workerIDsByFile[file] !== undefined) {
      return this.workerIDsByFile[file];
    } else {
      this.workerIDsByFile[file] = this.indexerPool.getIDs()[0];
      return this.workerIDsByFile[file];
    }
  }

  /**
   * Checks the places that global tokens might live and returns first found
   */
  getGlobalsForFile(file: string): GlobalTokens {
    // get old global tokens
    let globals: GlobalTokens = [];

    switch (true) {
      /**
       * Check if local
       */
      case file in this.tokensByFile:
        globals = this.tokensByFile[file].global;
        break;
      /**
       * Check if in global index which means the source is in our
       * worker thread
       */
      case file in this.globalIndex.globalTokensByFile:
        globals = this.globalIndex.globalTokensByFile[file];
        break;
      default:
        break;
    }

    return globals;
  }

  /**
   * Index code for a potential pseudo file (one that might be unsaved or we have unsaved edits)
   */
  async indexProCode(
    file: string,
    code: string | string[],
    postProcess = true
  ): Promise<IParsed | undefined> {
    try {
      // get old global tokens
      const oldGlobals = this.getGlobalsForFile(file);

      // track as known file
      this.knownFiles[file] = undefined;
      this.fileTypes['pro'].add(file);

      // alert everyone of new file
      if (this.isMultiThreaded()) {
        this.indexerPool.postToAll(LSP_WORKER_THREAD_MESSAGE_LOOKUP.ALL_FILES, {
          files: [file],
        });
      }

      /** Init value of parsed */
      let parsed: IParsed;

      /**
       * Flag if we have post processed already or not
       */
      let postProcessed = false;

      // determine how to proceed
      switch (true) {
        /**
         * Check if we farm work to a thread
         */
        case this.isMultiThreaded():
          postProcessed = postProcess;
          parsed = await this.indexerPool.workerio.postAndReceiveMessage(
            this.getWorkerID(file),
            LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_CODE,
            { file, code, postProcess }
          );
          break;
        /**
         * Default to doing the work here
         */
        default:
          parsed = Parser(code);
          this.workerIDsByFile[file] = undefined;
          break;
      }

      // save tokens for our file
      this.tokensByFile[file] = parsed;

      // add to our global index - do this before we post-process
      await this.saveGlobalTokens(file, parsed.global);

      // determine how to process
      switch (true) {
        case postProcessed:
          await this.changeDetection(parsed.global, oldGlobals);
          break;
        case postProcess:
          this.postProcessProFile(file, parsed, oldGlobals, true);
          break;
        default:
          break;
      }

      // if we dont post process, save our global tokens (auto happens in post process)
      this.trackSyntaxProblemsForFile(file, GetSyntaxProblems(parsed));

      // return our tokens
      return parsed;
    } catch (err) {
      this.log.log({
        log: IDL_LSP_LOG,
        type: 'error',
        content: [`${IDL_TRANSLATION.lsp.index.failedParse}: "${file}"`, err],
        alert: `${IDL_TRANSLATION.lsp.index.failedParse}: "${file}"`,
        alertMeta: {
          file,
        },
      });
      return undefined;
    }
  }

  /**
   * Returns the tokens for some code.
   *
   * Assumes that code is more up-to-date than whatever is on disk, so we wait for any
   * pending processes for the file to finish before we index it again
   *
   * TODO: Cancel pending requests, or find a way to update after they have been triggered?
   */
  async getParsedProCode(
    file: string,
    code: string | string[],
    postProcess?: boolean
  ): Promise<IParsed> {
    switch (true) {
      /**
       * Check for a pending file
       */
      case file in this.pendingFiles: {
        const current = await this.pendingFiles[file];
        delete this.pendingFiles[file];
        if (current.checksum === CodeChecksum(code)) {
          return current;
        }
        break;
      }
      /**
       * If multi-threaded, check if we have a copy of our parsed code
       *
       * Some duplication with indexProCode, but special case if we are multi threaded
       */
      case this.isMultiThreaded(): {
        if (file in this.tokensByFile) {
          if (this.tokensByFile[file].checksum === CodeChecksum(code)) {
            return this.tokensByFile[file];
          }
        }

        /**
         * Fetch from worker (it validates cache)
         */
        this.pendingFiles[file] =
          this.indexerPool.workerio.postAndReceiveMessage(
            this.getWorkerID(file),
            LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_CODE,
            { file, code, postProcess }
          );

        // get the latest - cache busting happens in the worker
        const current = await this.pendingFiles[file];
        delete this.pendingFiles[file];

        // get current global tokens
        const oldGlobals = this.getGlobalsForFile(file);

        // save and sync global tokens
        await this.saveGlobalTokens(file, current.global);

        // track syntax problems
        this.trackSyntaxProblemsForFile(file, GetSyntaxProblems(current));

        // do change detection
        if (postProcess) {
          await this.changeDetection(current.global, oldGlobals);
        }

        return current;
      }
      /**
       * Check if we have it stored locally
       */
      case file in this.tokensByFile: {
        if (this.tokensByFile[file].checksum === CodeChecksum(code)) {
          return this.tokensByFile[file];
        }
        break;
      }
      default:
    }

    /**
     * Re-index our code
     */
    this.pendingFiles[file] = this.indexProCode(file, code, postProcess);
    const res = await this.pendingFiles[file];
    delete this.pendingFiles[file];
    return res;
  }

  /**
   * Tracks the files we have open
   */
  trackFiles(files: string[]) {
    for (let i = 0; i < files.length; i++) {
      this.knownFiles[files[i]] = undefined;
    }
  }

  /**
   * Helper routine to search for PRO code files in one or more folders.
   *
   * When pattern in not specified, defaults to PRO code
   */
  async findFiles(
    folder: string | string[] | IFolderRecursion,
    pattern = PRO_CODE_GLOB_PATTERN
  ): Promise<string[]> {
    // init files that we find
    let files: string[] = [];

    // init folders
    let folders: string[] = [];
    let recursion: boolean[] = [];

    // handle our input type
    switch (true) {
      case typeof folder === 'string':
        folders.push(folder as string);
        recursion.push(true);
        break;
      case Array.isArray(folder):
        folders = folder as string[];
        recursion = new Array(folders.length).fill(true);
        break;
      default:
        folders = Object.keys(folder as IFolderRecursion);
        recursion = Object.values(folder as IFolderRecursion);
        break;
    }

    // process all of our folder
    for (let i = 0; i < folders.length; i++) {
      // skip folders if they dont exist
      if (!existsSync(folders[i])) {
        continue;
      }

      // join our files
      // 1. sort for consistency (might be excessive, unsure)
      // 2. make filenames filly-qualified, relative by default
      files = files.concat(
        (await glob(pattern, { cwd: folders[i], dot: true }))
          .sort()
          .map((file) => join(folders[i], file))
          .filter((file) =>
            recursion[i] ? true : dirname(file) === folders[i]
          )
      );
    }

    // track the files we found and sync them
    this.trackFiles(files);

    // get files
    return files;
  }

  /**
   * Given an array of files, removes files from our index and manages
   * our threads
   *
   * changeDetection is only honored if we are single-threaded and is always applied if multi-threaded
   */
  async removeWorkspaceFiles(files: string[], changeDetection = false) {
    // process in this thread if we don't have any workers
    if (!this.isMultiThreaded()) {
      // remove all files
      await this.removeFiles(files, changeDetection);
    }

    /**
     * Get the IDs for our workers
     */
    const ids = this.indexerPool.getIDs();

    /**
     * Promises tracking parsing in each worker
     */
    const remove: Promise<RemoveFilesResponse>[] = [];

    // submit all work for parsing
    for (let i = 0; i < this.nWorkers; i++) {
      remove.push(
        this.indexerPool.workerio.postAndReceiveMessage(
          ids[i],
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.REMOVE_FILES,
          {
            files,
          }
        )
      );
    }

    if (global.gc) {
      global.gc();
    }

    // before we wait, clean up this process
    for (let i = 0; i < files.length; i++) {
      await this.removeFile(files[i]);
    }

    /**
     * Wait for parsing promises to finish
     */
    await Promise.all(remove);

    /** Track any missing files */
    let missing: string[] = [];

    // save syntax problems for our file
    for (let i = 0; i < remove.length; i++) {
      // get response
      const res = await remove[i];

      // check if we have any other missing files while we were removing files
      missing = missing.concat(res.missing);

      // track syntax problems
      const keys = Object.keys(res.problems);
      for (let z = 0; z < keys.length; z++) {
        this.trackSyntaxProblemsForFile(keys[z], res.problems[keys[z]]);
      }
    }

    // check if we need to recurse
    if (missing.length > 0) {
      await this.removeWorkspaceFiles(missing, changeDetection);
    }
  }

  /**
   * Removes one or more workspaces from the search index
   */
  async removeWorkspace(
    folder: string | string[] | IFolderRecursion,
    changeDetection?: boolean
  ): Promise<string[]> {
    // find files to remove
    const files = await this.findFiles(folder);

    // remove files and handle threads
    await this.removeWorkspaceFiles(files, changeDetection);

    // return files we found
    return files;
  }

  /**
   * Indexes one or more files and cleans up as we go
   *
   * Intended for use in our worker threads. If in parent thread,
   * use `indexWorkspaceFiles` instead
   *
   * This method returns the missing files that we were asked to post-process, but dont exist
   */
  async indexProFiles(files: string[], postProcess = true): Promise<string[]> {
    /** Track any missing files */
    const missingFiles: string[] = [];

    // process each file
    for (let i = 0; i < files.length; i++) {
      // check if we dont actually have pro code
      if (!this.isPROCode(files[i])) {
        continue;
      }

      if (global.gc) {
        if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
          global.gc();
        }
      }

      // parse (or wait for it to finish if pending)
      try {
        await this.getParsedProCode(
          files[i],
          readFileSync(files[i], 'utf-8'),
          postProcess
        );
      } catch (err) {
        // check if we have a "false" error because a file was deleted
        if (!existsSync(files[i])) {
          missingFiles.push(files[i]);
          this.log.log({
            log: IDL_WORKER_THREAD_CONSOLE,
            type: 'warn',
            content: [
              `File was deleted, but we were not alerted before indexing files`,
              files[i],
            ],
          });
        } else {
          this.log.log({
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

    return missingFiles;
  }

  /**
   * Performs change detection and triggers post-processing of all files
   * that use our affected global tokens
   */
  async changeDetection(newGlobals: GlobalTokens, oldGlobals: GlobalTokens) {
    // verify we have changes in our global tokens
    if (CanChangeDetection(newGlobals, oldGlobals)) {
      /**
       * Merge old and new globals together. While there will be some
       * duplication, the number of globals is small.
       *
       * And we need this in case we removed a routine def that is in
       * the old globals and not the new ones
       */
      const changed = newGlobals.concat(oldGlobals);

      /**
       * Check if we run in our worker
       */
      if (this.isMultiThreaded()) {
        /** Get the IDs of all of our workers */
        const ids = this.indexerPool.getIDs();

        /** track promises for async processing */
        const proms: Promise<ChangeDetectionResponse>[] = [];

        // send the messages
        for (let i = 0; i < ids.length; i++) {
          // track promise
          proms.push(
            this.indexerPool.workerio.postAndReceiveMessage(
              ids[i],
              LSP_WORKER_THREAD_MESSAGE_LOOKUP.CHANGE_DETECTION,
              { changed }
            )
          );
        }

        // wait for it to finish
        await Promise.all(proms);

        // track missing files
        let missing: string[] = [];

        // save syntax problems for our files
        for (let i = 0; i < proms.length; i++) {
          // get response
          const res = await proms[i];

          // update missing
          missing = missing.concat(res.missing);

          // track problems
          const keys = Object.keys(res.problems);
          for (let z = 0; z < keys.length; z++) {
            this.trackSyntaxProblemsForFile(keys[z], res.problems[keys[z]]);
          }
        }

        // handle missing files if we have them
        if (missing.length > 0) {
          await this.removeWorkspaceFiles(missing);
        }
      } else {
        /**
         * Run locally
         */
        const change = ChangeDetection(this, changed);

        // check for missing files
        if (change.missing.length > 0) {
          await this.removeWorkspaceFiles(change.missing);
        }
      }
    }
  }

  /**
   * Post-process a single file
   *
   * If this fails, it reports it's own errors
   *
   * Change detection should only ever happen AFTER a workspace has
   * been indexed
   */
  async postProcessProFile(
    file: string,
    parsed: IParsed,
    oldGlobals: GlobalTokens,
    changeDetection = false
  ) {
    try {
      PostProcessParsed(this, file, parsed);

      // check if we need to do change detection
      if (changeDetection) {
        await this.changeDetection(parsed.global, oldGlobals);
      }
    } catch (err) {
      this.log.log({
        log: IDL_LSP_LOG,
        type: 'error',
        content: [`${IDL_TRANSLATION.lsp.index.failedParse}: "${file}"`, err],
        alert: `${IDL_TRANSLATION.lsp.index.failedParse}: "${file}"`,
        alertMeta: {
          file,
        },
      });
    }
  }

  /**
   * Post-process one or more files
   *
   * Intended for use in our worker threads. If in parent thread,
   * use `indexWorkspaceFiles` instead
   *
   * This method returns the missing files that we were asked to post-process, but dont exist
   */
  async postProcessProFiles(
    files: string[],
    changeDetection = false
  ): Promise<string[]> {
    /** Track any files that are missing and should no longer be tracked */
    const missingFiles: string[] = [];

    // process each file
    for (let i = 0; i < files.length; i++) {
      if (global.gc) {
        if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
          global.gc();
        }
      }

      try {
        await this.postProcessProFile(
          files[i],
          await this.getParsedProCode(
            files[i],
            readFileSync(files[i], 'utf-8')
          ),
          [],
          changeDetection
        );
      } catch (err) {
        // check if we have a "false" error because a file was deleted
        if (!existsSync(files[i])) {
          missingFiles.push(files[i]);
          this.log.log({
            log: IDL_WORKER_THREAD_CONSOLE,
            type: 'warn',
            content: [
              `File was deleted, but we were not alerted before post-processing files`,
              files[i],
            ],
          });
        } else {
          this.log.log({
            log: IDL_WORKER_THREAD_CONSOLE,
            type: 'error',
            content: [
              `Error while post processing files (likely from worker thread):`,
              err,
            ],
            alert: IDL_TRANSLATION.lsp.index.failedPostProcess,
          });
        }
      }
    }

    return missingFiles;
  }

  /**
   * Given an array of files, indexes them and handles the
   * parallel and post-processing logic for us.
   */
  private async indexWorkspaceProFilesFully(
    files: string[],
    buckets: string[][]
  ): Promise<void> {
    // return if not multi threaded
    if (!this.isMultiThreaded()) {
      return;
    }

    /**
     * Track the number of lines of code
     */
    let lines = 0;

    /** Get start time */
    const t0 = performance.now();

    /**
     * Get the IDs for our workers
     */
    const ids = this.indexerPool.getIDs();

    /**
     * Set IDs of files. do this afterwards so we can do something while we wait.
     */
    for (let i = 0; i < this.nWorkers; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        this.workerIDsByFile[buckets[i][j]] = ids[i];
      }
    }

    /**
     * Promises tracking parsing in each worker
     */
    const parsing: Promise<ParseFilesResponse>[] = [];

    // submit all work for parsing
    for (let i = 0; i < this.nWorkers; i++) {
      parsing.push(
        this.indexerPool.workerio.postAndReceiveMessage(
          ids[i],
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILES,
          {
            files: buckets[i],
          }
        )
      );
    }

    if (global.gc) {
      global.gc();
    }

    /**
     * Wait for parsing promises to finish
     */
    await Promise.all(parsing);

    /**
     * Messages for global token synchronization
     */
    const synchronize: Promise<LoadGlobalResponse>[] = [];

    /**
     * track any missing files
     */
    let missingFiles: string[] = [];

    /**
     * Sync global tokens to other workers
     */
    for (let i = 0; i < this.nWorkers; i++) {
      // unpack response
      const res = await parsing[i];

      // update any files that were missing
      missingFiles = missingFiles.concat(res.missing);

      // get files we parsed from our globals
      const iFiles = Object.keys(res.globals);
      for (let j = 0; j < iFiles.length; j++) {
        // track in our process
        this.globalIndex.trackGlobalTokens(res.globals[iFiles[j]], iFiles[j]);
      }

      // send message to all other workers
      for (let j = 0; j < this.nWorkers; j++) {
        // skip ourself
        if (j === i) {
          continue;
        }
        synchronize.push(
          this.indexerPool.workerio.postAndReceiveMessage(
            ids[j],
            LSP_WORKER_THREAD_MESSAGE_LOOKUP.TRACK_GLOBAL,
            res.globals
          )
        );
      }
    }

    if (global.gc) {
      global.gc();
    }

    // wait for all the sync messages to be processed
    await Promise.all(synchronize);

    /**
     * Post-processing promises
     */
    const postProcessing: Promise<PostProcessFilesResponse>[] = [];

    // submit all work for post-processing
    for (let i = 0; i < this.nWorkers; i++) {
      // track promise
      postProcessing.push(
        this.indexerPool.workerio.postAndReceiveMessage(
          ids[i],
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.POST_PROCESS_FILES,
          {
            /**
             * Send nothing and post-process all files in the thread
             */
            // files: buckets[i]
          }
        )
      );
    }

    if (global.gc) {
      global.gc();
    }

    /**
     * Wait for post processing to finish
     */
    await Promise.all(postProcessing);

    // save syntax problems for our file
    for (let i = 0; i < postProcessing.length; i++) {
      // get response
      const res = await postProcessing[i];

      // update lines of code
      lines += res.lines;

      // update missing files
      missingFiles = missingFiles.concat(res.missing);

      // track syntax problems for each file
      const keys = Object.keys(res.problems);
      for (let z = 0; z < keys.length; z++) {
        this.trackSyntaxProblemsForFile(keys[z], res.problems[keys[z]]);
      }
    }

    // calculate and save stats
    this.lastWorkspaceIndexStats = {
      haveStats: true,
      files: files.length,
      lines,
      time: performance.now() - t0,
    };

    /**
     * Check if we had any files that were deleted while we were trying to process
     */
    if (missingFiles.length > 0) {
      await this.removeWorkspaceFiles(missingFiles, false);
    }
  }

  /**
   * Given an array of files, quickly parses (not full parse) all of the files
   * we have to extract global tokens and syntax problems from parsing.
   *
   * Only for multi-threaded startups
   */
  private async indexWorkspaceProFilesFast(
    files: string[],
    buckets: string[][]
  ): Promise<void> {
    // return if not multi threaded
    if (!this.isMultiThreaded()) {
      return;
    }

    /**
     * Track the number of lines of code
     */
    let lines = 0;

    /** Get start time */
    const t0 = performance.now();

    /**
     * Get the IDs for our workers
     */
    const ids = this.indexerPool.getIDs();

    /**
     * Set IDs of files. do this afterwards so we can do something while we wait.
     */
    for (let i = 0; i < this.nWorkers; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        this.workerIDsByFile[buckets[i][j]] = ids[i];
      }
    }

    /**
     * Promises tracking parsing in each worker
     */
    const parsing: Promise<ParseFilesFastResponse>[] = [];

    // submit all work for parsing
    for (let i = 0; i < this.nWorkers; i++) {
      parsing.push(
        this.indexerPool.workerio.postAndReceiveMessage(
          ids[i],
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_FILES_FAST,
          {
            files: buckets[i],
          }
        )
      );
    }

    if (global.gc) {
      global.gc();
    }

    /**
     * Wait for parsing promises to finish
     */
    await Promise.all(parsing);

    /**
     * Messages for global token synchronization
     */
    const synchronize: Promise<LoadGlobalResponse>[] = [];

    /**
     * track any missing files
     */
    let missingFiles: string[] = [];

    /**
     * Sync global tokens to other workers
     */
    for (let i = 0; i < this.nWorkers; i++) {
      // unpack response
      const res = await parsing[i];

      // update any files that were missing
      missingFiles = missingFiles.concat(res.missing);

      // update lines of code
      lines += res.lines;

      // get files we parsed from our globals
      const iFiles = Object.keys(res.globals);
      for (let j = 0; j < iFiles.length; j++) {
        // track global tokens
        this.globalIndex.trackGlobalTokens(res.globals[iFiles[j]], iFiles[j]);

        // track syntax problems from parsing
        this.trackSyntaxProblemsForFile(iFiles[j], res.problems[iFiles[j]]);
      }

      // send message to all other workers
      for (let j = 0; j < this.nWorkers; j++) {
        // skip ourself
        if (j === i) {
          continue;
        }
        synchronize.push(
          this.indexerPool.workerio.postAndReceiveMessage(
            ids[j],
            LSP_WORKER_THREAD_MESSAGE_LOOKUP.TRACK_GLOBAL,
            res.globals
          )
        );
      }
    }

    if (global.gc) {
      global.gc();
    }

    // wait for all the sync messages to be processed
    await Promise.all(synchronize);

    // calculate and save stats
    this.lastWorkspaceIndexStats = {
      haveStats: true,
      files: files.length,
      lines,
      time: performance.now() - t0,
    };

    /**
     * Check if we had any files that were deleted while we were trying to process
     */
    if (missingFiles.length > 0) {
      await this.removeWorkspaceFiles(missingFiles, false);
    }
  }

  /**
   * Given an array of files, quickly parses (not full parse) all of the files
   * we have to extract global tokens and syntax problems from parsing.
   *
   * Only for multi-threaded startups
   */
  private async indexWorkspaceProFiles(
    files: string[],
    full: boolean
  ): Promise<void> {
    // process in this thread if we don't have any workers
    if (!this.isMultiThreaded()) {
      // index them
      const missing1 = await this.indexProFiles(files, false);

      // post-process all of our files
      const missing2 = await this.postProcessProFiles(files);

      // remove missing files if we have them
      const allMissing = missing1.concat(missing2);
      if (allMissing.length > 0) {
        this.removeWorkspaceFiles(allMissing);
      }

      // return the files we processed
      return;
    }

    // send to threads
    this.indexerPool.postToAll(LSP_WORKER_THREAD_MESSAGE_LOOKUP.ALL_FILES, {
      files,
    });

    // track that we have PRO files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.fileTypes['pro'].add(files[i]);
      }
    }

    /**
     * Split files into equal file sized buckets as best we can so that we
     * can evenly distribute work.
     *
     * Fi this is overkill, we can reduce later, but since we are optimizing
     * then may as well do everything we can do improve performance.
     */
    const buckets = SplitFiles(files, this.nWorkers);

    // check how we parse
    if (full) {
      return await this.indexWorkspaceProFilesFully(files, buckets);
    } else {
      return await this.indexWorkspaceProFilesFast(files, buckets);
    }
  }

  /**
   * Adds one or more workspace folders to the index
   */
  async indexWorkspace(
    folder: string | string[] | IFolderRecursion,
    full = true
  ): Promise<string[]> {
    // index config files
    await this.indexWorkspaceConfigFiles(folder);

    // index task files
    await this.indexWorkspaceTaskFiles(folder);

    // find files
    const files = await this.findFiles(folder);

    // do the indexing
    await this.indexWorkspaceProFiles(files, full);

    // get/track SAVE files
    const saves = await this.findFiles(folder, SAVE_FILE_GLOB_PATTERN);
    for (let i = 0; i < saves.length; i++) {
      this.fileTypes['save'].add(saves[i]);
    }

    // return the files we found
    return files;
  }

  /**
   * Main entry point to index a new file given the filepath and the content of the file
   *
   * This method internally handles the logic of the type of file we are processing (i.e. task, PRO, idl.json)
   */
  async indexFile(file: string, code?: string) {
    if (!existsSync(file)) {
      this.removeWorkspaceFiles([file]);
      return;
    }
    if (code === undefined) {
      code = readFileSync(file, 'utf-8');
    }
    switch (true) {
      case this.isConfigFile(file):
        await this.indexConfigFile(file, code);
        break;
      case this.isTaskFile(file):
        await this.indexTaskFile(file, code);
        break;
      case this.isPROCode(file):
        await this.getParsedProCode(file, code, true);
        break;
      default:
        break;
    }
  }

  /**
   * Given an array of files, indexes them and internally separates files
   * by their type
   */
  async indexFiles(files: string[], cb: (file: string) => Promise<string>) {
    /** PRO files that we need to index */
    const proFiles: string[] = [];

    /** Config files that we need to process */
    const configFiles: string[] = [];

    /** Task files that we need to process */
    const taskFiles: string[] = [];

    // process all files
    for (let i = 0; i < files.length; i++) {
      switch (true) {
        case this.isPROCode(files[i]):
          proFiles.push(files[i]);
          break;
        case this.isConfigFile(files[i]):
          configFiles.push(files[i]);
          break;
        case this.isTaskFile(files[i]):
          taskFiles.push(files[i]);
          break;
        default:
          // do nothing
          break;
      }
    }

    /**
     * Update IDL config files
     */
    for (let i = 0; i < configFiles.length; i++) {
      await this.indexConfigFile(configFiles[i], await cb(configFiles[i]));
    }

    /**
     * Update task files
     */
    for (let i = 0; i < taskFiles.length; i++) {
      await this.indexTaskFile(taskFiles[i], await cb(taskFiles[i]));
    }

    // process all of our PRO files, one at a time and perform post processing and
    // change detection
    // this is not optimized, but works and the number of files here
    // should be small, so this should be pretty fast
    for (let i = 0; i < proFiles.length; i++) {
      await this.getParsedProCode(proFiles[i], await cb(proFiles[i]), true);
    }
  }
}
