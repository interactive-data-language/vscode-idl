import { DOT_IDL_FOLDER } from '@idl/shared';
import { join } from 'path';

/**
 * Notebook folder for cells
 */
export const NOTEBOOK_FOLDER = join(DOT_IDL_FOLDER, 'notebooks');

/**
 * Folder for example notebooks
 */
export const EXAMPLE_NOTEBOOKS = join(NOTEBOOK_FOLDER, 'examples');

/**
 * Folder for notebooks from docs
 */
export const DOCS_NOTEBOOK_FOLDER = join(NOTEBOOK_FOLDER, 'docs');
