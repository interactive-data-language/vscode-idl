import { GetExtensionPath } from '@idl/shared';

/**
 * Default port for our docs server
 */
export const DOCS_SERVER_CONFIG = {
  /** Port we serve docs from */
  PORT: 3344,
  /** Folder the docs live in (fully-qualified) */
  FOLDER: GetExtensionPath('dist/docs'),
};
