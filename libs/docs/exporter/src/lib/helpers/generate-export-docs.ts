import {
  GLOBAL_TOKEN_TYPES,
  GlobalTokenType,
  IGlobalIndexedToken,
} from '@idl/types/core';

/**
 * Clean up docs for vitepress
 */
function EscapeDocs(docs: string) {
  return docs.replace(/</g, '\\<');
}

export function GenerateExportDocs<T extends GlobalTokenType>(
  item: IGlobalIndexedToken<T>
): string {
  // get initial value of docs
  const docs = item.meta.docs;

  // format docs
  switch (true) {
    case item.type === GLOBAL_TOKEN_TYPES.FUNCTION ||
      item.type === GLOBAL_TOKEN_TYPES.FUNCTION_METHOD ||
      item.type === GLOBAL_TOKEN_TYPES.PROCEDURE ||
      item.type === GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD:
      // do nothing
      break;
    case item.type === GLOBAL_TOKEN_TYPES.STRUCTURE:
      // do nothing
      break;
    default:
    // do nothing
  }

  return EscapeDocs(docs);
}
