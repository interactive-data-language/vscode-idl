import { LANGUAGE_NAME as L } from './language.interface';

/** Base string that all commands start with */
export const BASE_COMMAND = `${L}.`;

/**
 * ALL OF THESE BASE COMMAND STRINGS MUST BE UNIQUE
 */

/** Base string for debug commands */
export const BASE_CLIENT = `${BASE_COMMAND}client.`;

/** Base string for code commands */
export const BASE_CODE = `${BASE_COMMAND}code.`;

/** base commands for configuration */
export const BASE_CONFIG = `${BASE_COMMAND}config.`;

/** Base string for debug commands */
export const BASE_DEBUG = `${BASE_COMMAND}debug.`;

/** Base string for terminal commands */
export const BASE_TERMINAL = `${BASE_COMMAND}terminal.`;

/** Base string for webview commands */
export const BASE_WEBVIEW = `${BASE_COMMAND}webview.`;

/** Base string for docs commands */
export const BASE_DOCS = `${BASE_COMMAND}docs.`;

/**
 * Constant representing all of our commands in IDL.
 *
 * This is used so you dont actually need to know each command and, if
 * we need to change commands in the future this makes it really easy.
 *
 * This is also used to build/check our package.json and make sure it
 * is kosher.
 */
export const IDL_COMMANDS = {
  /** Commands for our extension client (generic) */
  CLIENT: {
    /** Report a bug/problem with extension */
    REPORT_PROBLEM: `${BASE_CLIENT}fileABug`,
    /** View IDL logs */
    VIEW_LOGS: `${BASE_CLIENT}viewLogs`,
    /**
     * View preferences
     */
    VIEW_SETTING: `${BASE_CLIENT}viewSettings`,
  },
  CODE: {
    /** Initialize IDL config (idl.json) in workspace */
    // INITIALIZE_CONFIG: `${BASE_CODE}initializeConfig`,
    /** Add/update docs for file */
    ADD_DOCS_TO_FILE: `${BASE_CODE}addDocsToFile`,
    /** Formats a file */
    FORMAT_FILE: `${BASE_CODE}formatFile`,
    /** Generate task file */
    GENERATE_TASK: `${BASE_CODE}generateTask`,
  },
  /** Commands to adjust the configuration of the extension for VSCode */
  CONFIG: {
    /** Specify user-scoped IDL directory */
    IDL_DIR_USER: `${BASE_CONFIG}specifyIDLDirectory`,
    /** Specify workspace-scoped IDL directory */
    IDL_DIR_WORKSPACE: `${BASE_CONFIG}specifyIDLDirectoryWorkspace`,
  },
  /** Commands for starting and interacting with a debug session of IDL */
  DEBUG: {
    /** Start debug session */
    START: `${BASE_DEBUG}startIDL`,
    /** Compile current PRO file */
    COMPILE: `${BASE_DEBUG}compileFile`,
    /** Run current PRO file */
    RUN: `${BASE_DEBUG}runFile`,
    /** Run current PRO file as a batch file */
    EXECUTE_BATCH: `${BASE_DEBUG}executeBatchFile`,
    /** Reset IDL session */
    RESET: `${BASE_DEBUG}resetIDL`,
    /** Start profiling */
    PROFILER_START: `${BASE_DEBUG}startProfiling`,
    /** Stop profiling */
    PROFILER_STOP: `${BASE_DEBUG}stopProfiling`,
  },
  // /** Commands for starting and interacting with a terminal session of IDL */
  // TERMINAL: {
  //   /** Start debug session */
  //   START: `${BASE_TERMINAL}openIDL`,
  //   /** Compile current PRO file */
  //   COMPILE: `${BASE_TERMINAL}compileFile`,
  //   /** Run current PRO file */
  //   RUN: `${BASE_TERMINAL}runFile`,
  //   /** Run current PRO file as a batch file */
  //   EXECUTE_BATCH: `${BASE_TERMINAL}executeBatchFile`,
  //   /** Reset IDL session */
  //   RESET: `${BASE_TERMINAL}resetIDL`,
  //   /** Interrupt IDL */
  //   STOP: `${BASE_TERMINAL}stopExecution`,
  //   /** Continue executing */
  //   CONTINUE: `${BASE_TERMINAL}continueExecution`,
  //   /** Step into routine */
  //   STEP_IN: `${BASE_TERMINAL}stepIn`,
  //   /** Step out of routine */
  //   STEP_OVER: `${BASE_TERMINAL}stepOver`,
  //   /** Step out of routine */
  //   STEP_OUT: `${BASE_TERMINAL}stepOut`,
  // },
  /** Commands related to our webview */
  WEBVIEW: {
    /** Starts/shows our webview */
    START: `${BASE_WEBVIEW}start`,
  },
  /** Commands related to our documentation for the extension */
  DOCS: {
    /** Opens extension docs */
    OPEN: `${BASE_DOCS}open`,
  },
};
