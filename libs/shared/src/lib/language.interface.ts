/**
 * Constant for the publisher ID of the extension
 *
 * Here for easy access in case we ever need to change it
 */
export const EXTENSION_PUBLISHER_NAME = 'idl';

/**
 * Name for our extension
 */
export const EXTENSION_NAME = 'interactive-data-language';

/**
 * Name for our extension config.
 *
 * NOTE: Changing this here is not all you need to do. You will also need to
 * adjust the package.json config information.
 */
export const LANGUAGE_NAME = 'idl';

/**
 * For syntax highlighting, the scope we use for IDL symbols
 */
export const LANGUAGE_TOKEN_SCOPE_NAME = `source.${LANGUAGE_NAME}`;

/**
 * Name of the extension in VSCode
 *
 * Publisher ane name from the package.json file
 */
export const EXTENSION_FULL_NAME = `${EXTENSION_PUBLISHER_NAME}.${EXTENSION_NAME}`;

/**
 * File extension for PRO files
 */
export const IDL_FILE_EXTENSION = '.pro';

/**
 * File extension for SAVE files
 */
export const IDL_SAVE_FILE_EXTENSION = '.sav';

/**
 * File extensions for task files
 */
export const TASK_FILE_EXTENSION = '.task';

/**
 * File naming for config files
 */
export const LANGUAGE_SERVER_CONFIG_URI = 'idl.json';

/**
 * File extensions for ENVI Task style files
 */
export const TASK_STYLE_FILE_EXTENSION = '.style';

/**
 * File extensions for ENVI Modeler files
 */
export const MODEL_FILE_EXTENSION = '.model';

/**
 * File extensions for ENVI Vector Style files
 */
export const EVS_FILE_EXTENSION = '.evs';

/**
 * File extensions for ENVI PPT Template files
 */
export const EPT_FILE_EXTENSION = '.ept';

/**
 * Glob pattern for PRO files
 */
export const PRO_CODE_GLOB_PATTERN = `**/*${IDL_FILE_EXTENSION}`;

/**
 * Glob pattern for SAVE files
 */
export const SAVE_FILE_GLOB_PATTERN = `**/*${IDL_SAVE_FILE_EXTENSION}`;

/**
 * Glob pattern for idl.json files
 */
export const CONFIG_FILE_GLOB_PATTERN = `**/*${LANGUAGE_SERVER_CONFIG_URI}`;

/**
 * Glob pattern for task files
 */
export const TASK_FILE_GLOB_PATTERN = `**/*${TASK_FILE_EXTENSION}`;

/**
 * Name for our icon theme
 */
export const ICON_THEME_NAME = `${LANGUAGE_NAME}-icons`;

/**
 * Language for the output from IDL so we can apply nice formatting and coloring
 */
export const LOG_LANGUAGE_NAME = `${LANGUAGE_NAME}-log`;

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
  pattern: CONFIG_FILE_GLOB_PATTERN,
  scheme: 'file',
};

/**
 * Language identifier for task files
 */
export const IDL_CONFIG_FILE_DOCUMENT_SELECTOR = {
  pattern: TASK_FILE_GLOB_PATTERN,
  scheme: 'file',
};
