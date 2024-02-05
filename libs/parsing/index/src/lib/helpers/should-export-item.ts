import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

import { GlobalIndexedToken } from '../global-index.interface';

/**
 * Determines if we should export the given global token or not
 */
export function ShouldExportItem(item: GlobalIndexedToken): boolean {
  switch (true) {
    /**
     * Always export structures (they never have docs, only props do)
     */
    case item.type === GLOBAL_TOKEN_TYPES.STRUCTURE:
      return true;

    /**
     * No docs
     */
    case !item.meta.docs.trim():
      return false;

    /**
     * Private routine?
     */
    case item.meta.private:
      return false;

    /**
     * Class init method?
     */
    case item.type === GLOBAL_TOKEN_TYPES.FUNCTION_METHOD &&
      item.name.endsWith('::init'):
      return false;

    /**
     * Structure definition procedure
     */
    case item.type === GLOBAL_TOKEN_TYPES.PROCEDURE &&
      item.name.endsWith('__define'):
      return false;

    /**
     * If main level programs somehow get in
     */
    case item.name === '$main$':
      return false;

    /**
     * Otherwise export
     */
    default:
      return true;
  }
}
