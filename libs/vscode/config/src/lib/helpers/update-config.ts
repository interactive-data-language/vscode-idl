import { IDL_EXTENSION_CONFIG } from '../initialize-extension-config';

/**
 * Helper to update config and verify we pass in the right values
 *
 * This is because, for objects, we have to have other logic for
 * some stupid reason and pass all other values.
 *
 * This feel like a very fragile design from VSCode.
 */
export function UpdateConfigObject<T>(
  key: string,
  value: Partial<T>,
  global = true
) {
  IDL_EXTENSION_CONFIG.update(
    key,
    { ...IDL_EXTENSION_CONFIG.get(key), ...value },
    global
  );
}
