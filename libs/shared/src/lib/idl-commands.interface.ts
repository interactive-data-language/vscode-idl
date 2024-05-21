import { IDL_LANGUAGE_NAME as L } from './language.interface';

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

/** Base string for notebook */
export const BASE_NOTEBOOK = `${BASE_COMMAND}notebooks.`;

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
    /** Formats all files in a workspace */
    FORMAT_WORKSPACE: `${BASE_CODE}formatWorkspace`,
    /** Generate task file */
    GENERATE_TASK: `${BASE_CODE}generateTask`,
    /** Migrate PRO code to the ENVI DL 3.0 API */
    MIGRATE_TO_DL30_API: `${BASE_CODE}migrateToDL30API`,
    /** Disable problem code through settings */
    DISABLE_PROBLEM_SETTING: `${BASE_CODE}disableProblemSetting`,
    /** Auto fix problem */
    FIX_PROBLEM: `${BASE_CODE}fixProblem`,
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
  /** Commands for starting and interacting with a debug session of IDL */
  NOTEBOOKS: {
    /** Convert notebook to markdown */
    CONVERT_TO_PDF: `${BASE_NOTEBOOK}convertToPDF`,
    /** Convert notebook to markdown */
    // CONVERT_TO_PDF: `${BASE_NOTEBOOK}convertToPDF`,
    /** Convert help to notebooks */
    HELP_AS_NOTEBOOK: `${BASE_NOTEBOOK}helpAsNotebook`,
    /** Create a new notebook */
    NEW_NOTEBOOK: `${BASE_NOTEBOOK}newNotebook`,
    /** Convert a notebook to PRO code */
    NOTEBOOK_TO_PRO_CODE: `${BASE_NOTEBOOK}notebookToProCode`,
    /** Open IDL example notebook */
    OPEN_IDL_EXAMPLE: `${BASE_NOTEBOOK}openIDLExample`,
    /** Open ENVI example notebook */
    OPEN_ENVI_EXAMPLE: `${BASE_NOTEBOOK}openENVIExample`,
    /** Reset IDL session for notebook */
    RESET: `${BASE_NOTEBOOK}resetIDLKernel`,
    /** Reset example notebooks */
    RESET_NOTEBOOK_EXAMPLES: `${BASE_NOTEBOOK}resetNotebookExamples`,
    /** Reset IDL session for notebook */
    STOP: `${BASE_NOTEBOOK}stopIDLKernel`,
    /** Stop all IDL kernels */
    STOP_ALL_KERNELS: `${BASE_NOTEBOOK}stopAllIDLKernels`,
  },
  /** Commands for starting and interacting with a terminal session of IDL */
  TERMINAL: {
    /** Start debug session */
    START: `${BASE_TERMINAL}startIDL`,
    /** Compile current PRO file */
    COMPILE: `${BASE_TERMINAL}compileFile`,
    /** Run current PRO file */
    RUN: `${BASE_TERMINAL}runFile`,
    /** Run current PRO file as a batch file */
    EXECUTE_BATCH: `${BASE_TERMINAL}executeBatchFile`,
    /** Reset IDL session */
    RESET: `${BASE_TERMINAL}resetIDL`,
    /** Interrupt IDL */
    PAUSE: `${BASE_TERMINAL}pauseExecution`,
    /** Continue executing */
    CONTINUE: `${BASE_TERMINAL}continueExecution`,
    /** Step into routine */
    STEP_IN: `${BASE_TERMINAL}stepIn`,
    /** Step out of routine */
    STEP_OVER: `${BASE_TERMINAL}stepOver`,
    /** Step out of routine */
    STEP_OUT: `${BASE_TERMINAL}stepOut`,
  },
  /** Commands related to our webview */
  WEBVIEW: {
    /** Starts/shows our webview */
    START: `${BASE_WEBVIEW}start`,
  },
  /** Commands related to our documentation for the extension */
  DOCS: {
    /** Opens extension docs */
    OPEN: `${BASE_DOCS}open`,
    /** Opens link from docs */
    OPEN_LINK: `${BASE_DOCS}openLink`,
  },
};
