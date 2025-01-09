/**
 * Types of files that we track
 */
export type IDLFileType =
  | 'pro'
  | 'pro-def'
  | 'save'
  | 'idl.json'
  | 'envi-task'
  | 'idl-task'
  | 'idl-notebook';

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
  'idl.json': new Set(),
  'idl-task': new Set(),
  'envi-task': new Set(),
  'idl-notebook': new Set(),
};
