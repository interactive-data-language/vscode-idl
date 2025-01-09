import {
  IDL_JSON_GLOB_PATTERN,
  PRO_CODE_GLOB_PATTERN,
  PRO_DEF_GLOB_PATTERN,
  TASK_FILE_GLOB_PATTERN,
} from './idl-file-extensions.interface';

/**
 * Constant for the publisher ID of the extension
 *
 * Here for easy access in case we ever need to change it
 */
export const EXTENSION_PUBLISHER_NAME = 'idl';

/**
 * Name for our extension
 */
export const EXTENSION_NAME = 'idl-for-vscode';

/**
 * Name for our extension config.
 */
export const IDL_LANGUAGE_NAME = 'idl';

/**
 * For syntax highlighting, the scope we use for IDL symbols
 */
export const LANGUAGE_TOKEN_SCOPE_NAME = `source.${IDL_LANGUAGE_NAME}`;

/**
 * The name of IDL notebooks
 */
export const IDL_NOTEBOOK_LANGUAGE_NAME = `${IDL_LANGUAGE_NAME}-notebook`;

/**
 * The name of IDL notebooks
 */
export const IDL_NOTEBOOK_CONTROLLER_NAME = `${IDL_LANGUAGE_NAME}-notebook-controller`;

/**
 * Translation key for notebook controller
 */
export const IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME =
  '%notebooks.controller%';

/**
 * The name of IDL notebook renderer
 */
export const IDL_NOTEBOOK_RENDERER_NAME = `${IDL_NOTEBOOK_LANGUAGE_NAME}-renderer`;

/**
 * Name of the extension in VSCode
 *
 * Publisher ane name from the package.json file
 */
export const EXTENSION_FULL_NAME = `${EXTENSION_PUBLISHER_NAME}.${EXTENSION_NAME}`;

/**
 * Name for our icon theme
 */
export const ICON_THEME_NAME = `${IDL_LANGUAGE_NAME}-icons`;

/**
 * Language for the output from IDL so we can apply nice formatting and coloring
 */
export const LOG_LANGUAGE_NAME = `${IDL_LANGUAGE_NAME}-log`;

/**
 * Scope name for our log syntax highlighting
 */
export const LOG_LANGUAGE_TOKEN_SCOPE_NAME = `source.${LOG_LANGUAGE_NAME}`;

/**
 * Language identifier for IDL (per docs for DocumentSelector)
 */
export const PRO_CODE_DOCUMENT_SELECTOR = {
  pattern: PRO_CODE_GLOB_PATTERN,
  scheme: 'file',
};

/**
 * Language identifier for IDL def files
 */
export const PRO_DEF__DOCUMENT_SELECTOR = {
  pattern: PRO_DEF_GLOB_PATTERN,
  scheme: 'file',
};

/**
 * Language identifier for task files
 */
export const TASK_FILE_DOCUMENT_SELECTOR = {
  pattern: IDL_JSON_GLOB_PATTERN,
  scheme: 'file',
};

/**
 * Language identifier for task files
 */
export const IDL_CONFIG_FILE_DOCUMENT_SELECTOR = {
  pattern: TASK_FILE_GLOB_PATTERN,
  scheme: 'file',
};

/**
 * Selector for IDL notebook cells
 */
export const IDL_NOTEBOOK_CELL_SELECTOR = {
  scheme: 'vscode-notebook-cell', // only notebook cells
  language: IDL_LANGUAGE_NAME,
};

/**
 * All document selectors for the language server
 */
export const ALL_DOCUMENT_SELECTORS = [
  PRO_CODE_DOCUMENT_SELECTOR,
  PRO_DEF__DOCUMENT_SELECTOR,
  TASK_FILE_DOCUMENT_SELECTOR,
  IDL_CONFIG_FILE_DOCUMENT_SELECTOR,
  IDL_NOTEBOOK_CELL_SELECTOR,
];
