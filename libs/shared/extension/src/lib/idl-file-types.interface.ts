/**
 * Types of files that we track
 */
export type IDLFileType =
  | 'envi-task'
  | 'idl-notebook'
  | 'idl-task'
  | 'idl-format'
  | 'pro-def'
  | 'pro'
  | 'save';

/**
 * Lookup by file type
 */
export type IDLFileTypeLookup = {
  [T in IDLFileType]: Set<string>;
};

/**
 * IDL file type lookup
 */
export const IDL_FILE_TYPE_LOOKUP: IDLFileTypeLookup = {
  pro: new Set(),
  'pro-def': new Set(),
  save: new Set(),
  'idl-format': new Set(),
  'idl-task': new Set(),
  'envi-task': new Set(),
  'idl-notebook': new Set(),
};
