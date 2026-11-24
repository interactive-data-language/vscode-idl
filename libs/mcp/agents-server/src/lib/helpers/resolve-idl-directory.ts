import { FindIDL, MatchesIDLVersion, ValidateIDLDir } from '@idl/idl/files';
import type { IAgentServerConfig } from '@idl/types/agents';

import type { IConfigProblem } from './validate-config.interface';

/** Minimum IDL version supported by the agents server. */
export const AGENTS_SERVER_MIN_IDL_VERSION = '9.2';

/** Resolve and check the executable directory for both validation and startup. */
export function ResolveIDLDirectoryOrProblem(
  config: IAgentServerConfig,
): IConfigProblem | string {
  const configured = config.idl.directory.trim();
  const resolved = configured || FindIDL(AGENTS_SERVER_MIN_IDL_VERSION, '>=');
  if (!resolved || !ValidateIDLDir(resolved)) {
    return configured
      ? {
          code: 'IDL_DIRECTORY_INVALID',
          message: `"idl.directory" does not contain an IDL executable: ${configured}`,
        }
      : {
          code: 'IDL_NOT_FOUND',
          message: `Unable to find IDL ${AGENTS_SERVER_MIN_IDL_VERSION}+. Install a supported version, set "idl.directory", or set the IDL_DIR environment variable.`,
        };
  }

  // An unversioned custom directory is not evidence of an unsupported IDL.
  if (MatchesIDLVersion(resolved, AGENTS_SERVER_MIN_IDL_VERSION, '<')) {
    return {
      code: 'IDL_VERSION_UNSUPPORTED',
      message: `Unsupported IDL installation at "${resolved}". The agents server requires IDL ${AGENTS_SERVER_MIN_IDL_VERSION}+.`,
    };
  }
  return resolved;
}

/**
 * Returns the folder containing the IDL executable, or undefined if we can't find one.
 *
 * A configured directory is used as-is and never falls back to searching, so a
 * typo is reported instead of silently picking a different install.
 */
export function ResolveIDLDirectory(
  config: IAgentServerConfig,
): string | undefined {
  const result = ResolveIDLDirectoryOrProblem(config);
  return typeof result === 'string' ? result : undefined;
}
