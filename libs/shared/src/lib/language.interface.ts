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
 *
 * NOTE: Changing this here is not all you need to do. You will also need to
 * adjust the package.json config information.
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
 * File extensions for ENVI PPT Template files
 */
export const EPT_FILE_EXTENSION = '.ept';

/**
 * File extensions for ENVI Vector Style files
 */
export const EVS_FILE_EXTENSION = '.evs';

/**
 * File naming for config files
 */
export const IDL_JSON_URI = 'idl.json';

/**
 * File extension for IDL notebooks
 */
export const IDL_NOTEBOOK_EXTENSION = '.idlnb';

/**
 * File extension for SAVE files
 */
export const IDL_SAVE_FILE_EXTENSION = '.sav';

/**
 * File extensions for ENVI Modeler files
 */
export const MODEL_FILE_EXTENSION = '.model';

/**
 * File extension for PRO files
 */
export const PRO_FILE_EXTENSION = '.pro';

/**
 * Type definition file extension
 */
export const PRO_DEF_EXTENSION = '.pro.def';

/**
 * File extensions for task files
 */
export const TASK_FILE_EXTENSION = '.task';

/**
 * File extensions for ENVI Task style files
 */
export const TASK_STYLE_FILE_EXTENSION = '.style';

/**
 * Glob pattern for idl.json files
 */
export const IDL_JSON_GLOB_PATTERN = `**/*${IDL_JSON_URI}`;

/**
 * Glob pattern for notebooks
 */
export const NOTEBOOK_GLOB_PATTERN = `**/*${IDL_NOTEBOOK_EXTENSION}`;

/**
 * Glob pattern for PRO files
 */
export const PRO_CODE_GLOB_PATTERN = `**/*${PRO_FILE_EXTENSION}`;

/**
 * Glob pattern for IDL type definition files
 */
export const PRO_DEF_GLOB_PATTERN = `**/*${PRO_DEF_EXTENSION}`;

/**
 * Glob pattern for SAVE files
 */
export const SAVE_FILE_GLOB_PATTERN = `**/*${IDL_SAVE_FILE_EXTENSION}`;

/**
 * Glob pattern for task files
 */
export const TASK_FILE_GLOB_PATTERN = `**/*${TASK_FILE_EXTENSION}`;

/**
 * Glob pattern for all files
 */
export const ALL_FILES_GLOB_PATTERN = `**/*(*${PRO_FILE_EXTENSION}|*${PRO_DEF_GLOB_PATTERN}|*${IDL_SAVE_FILE_EXTENSION}|*${IDL_JSON_URI}|*${TASK_FILE_EXTENSION}|*${IDL_NOTEBOOK_EXTENSION})`;

/**
 * Glob pattern for files we want to actively watch in VSCode
 */
export const NOTIFY_FILES_GLOB_PATTERN = `**/*(*${PRO_FILE_EXTENSION}|*${PRO_DEF_GLOB_PATTERN}|*${IDL_JSON_URI}|*${TASK_FILE_EXTENSION}|*${IDL_NOTEBOOK_EXTENSION})`;

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
export const IDL_DOCUMENT_SELECTOR = {
  pattern: PRO_CODE_GLOB_PATTERN,
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
  IDL_DOCUMENT_SELECTOR,
  TASK_FILE_DOCUMENT_SELECTOR,
  IDL_CONFIG_FILE_DOCUMENT_SELECTOR,
  IDL_NOTEBOOK_CELL_SELECTOR,
];
