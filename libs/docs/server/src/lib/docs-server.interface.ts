import { GetExtensionPath } from '@idl/idl/files';
/**
 * Default port for our docs server
 */
export const DOCS_SERVER_CONFIG = {
  /** Folder the docs live in (fully-qualified) */
  FOLDER: GetExtensionPath('dist/docs'),
};
