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
 * File naming for IDL Package JSON file
 */
export const IDL_PACKAGE_URI = 'idlpackage.json';

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
 * Glob pattern for IDL Package files
 */
export const IDL_PACKAGE_GLOB_PATTERN = `**/*${IDL_PACKAGE_URI}`;

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
export const ALL_FILES_GLOB_PATTERN = `**/*(*${PRO_FILE_EXTENSION}|*${PRO_DEF_EXTENSION}|*${IDL_SAVE_FILE_EXTENSION}|*${IDL_JSON_URI}||*${TASK_FILE_EXTENSION}|*${IDL_NOTEBOOK_EXTENSION})`;

/**
 * Glob pattern for files we want to actively watch in VSCode
 */
export const NOTIFY_FILES_GLOB_PATTERN = `**/*(*${PRO_FILE_EXTENSION}|*${PRO_DEF_EXTENSION}|*${IDL_JSON_URI}||*${TASK_FILE_EXTENSION}|*${IDL_NOTEBOOK_EXTENSION})`;
