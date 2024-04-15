import { IDL_LOGGER } from '@idl/vscode/client';

import { IDLDecorationsManager } from './idl-decorations-manager.class';

/**
 * Notebook controller for IDL notebooks
 */
export const IDL_DECORATIONS_MANAGER = new IDLDecorationsManager();

/**
 * Initializes our file decoration manager
 */
export function InitializeDecorations() {
  IDL_LOGGER.log({
    content: 'Initializing IDL Decorations Manager',
  });

  // do nothing
}
