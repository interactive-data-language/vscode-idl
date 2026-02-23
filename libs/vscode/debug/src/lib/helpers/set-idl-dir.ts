import { FindIDL } from '@idl/idl/files';
import { CleanPath } from '@idl/shared/extension';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { existsSync } from 'fs';

/**
 * If the IDL directory has not been configured, automatically
 * tries to find IDL and update our preferences with a newer version
 * of IDL
 */
export function SetIDLDir() {
  /**
   * Check for IDL
   */
  if (
    !IDL_EXTENSION_CONFIG.IDL.directory ||
    !existsSync(IDL_EXTENSION_CONFIG.IDL.directory)
  ) {
    const dir = FindIDL();
    if (dir) {
      IDL_EXTENSION_CONFIG.update(
        IDL_EXTENSION_CONFIG_KEYS.IDLDirectory,
        CleanPath(dir),
        true
      );
    }
  }
}
