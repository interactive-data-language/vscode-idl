import { GlobalIndexedToken } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

/**
 * Determines if we should export the given global token or not
 */
export function ShouldExportItem(item: GlobalIndexedToken): boolean {
  switch (true) {
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
    default:
      return true;
  }
}
