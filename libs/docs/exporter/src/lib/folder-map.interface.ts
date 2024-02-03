import { GlobalTokenType } from '@idl/types/core';
import { join } from 'path';

/**
 * Other docs paths
 */
export const DOCS_PATHS = {
  /** Where ENVI Tasks go */
  ENVI_TASK: join('task', 'envi'),
  /** Where IDL Tasks go */
  IDL_TASK: join('task', 'IDL'),
  /** Where classes go */
  CLASS: 'class',
};

/**
 * Maps global token types to folders
 */
export type GlobalTypePathMap = {
  [key in GlobalTokenType]: string;
};

/** Folders for global tokens */
export const GLOBAL_TYPE_PATHS: GlobalTypePathMap = {
  c: 'common', // common block
  f: 'func',
  fm: join(DOCS_PATHS.CLASS, 'func'),
  p: 'pro',
  pm: join(DOCS_PATHS.CLASS, 'pro'),
  s: 'struct',
  sv: 'sys-var',
};
