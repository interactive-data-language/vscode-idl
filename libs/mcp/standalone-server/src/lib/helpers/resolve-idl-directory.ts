import { FindIDL, ValidateIDLDir } from '@idl/idl/files';
import type { IAgentServerConfig } from '@idl/types/agents';

/**
 * Returns the folder containing the IDL executable, or undefined if we can't find one.
 *
 * A configured directory is used as-is and never falls back to searching, so a
 * typo is reported instead of silently picking a different install.
 */
export function ResolveIDLDirectory(
  config: IAgentServerConfig,
): string | undefined {
  const directory = config.idl.directory.trim();

  if (directory !== '') {
    return ValidateIDLDir(directory) ? directory : undefined;
  }

  return FindIDL();
}
