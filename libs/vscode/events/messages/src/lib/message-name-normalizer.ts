import { IDL_LANGUAGE_NAME } from '@idl/shared';

/**
 * Internal function to wrap the name of all messages so that we are
 * always unique.
 *
 * This is a safety measure to prevent event naming conflicts with the
 * VSCode standard
 */
export function MessageNameNormalizer(name: string) {
  return `${IDL_LANGUAGE_NAME}.${name}`;
}
