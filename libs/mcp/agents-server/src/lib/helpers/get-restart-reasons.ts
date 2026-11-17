import type { IAgentServerConfig } from '@idl/types/agents';
import { deepEqual } from 'fast-equals';
import { resolve } from 'path';

/**
 * Normalizes package paths so only meaningful changes count. Order is kept
 * because the first path wins when package names conflict.
 */
function NormalizePaths(paths: string[]): string[] {
  return Array.from(new Set(paths.map((item) => resolve(item))));
}

/**
 * Compares two configs and returns the properties that changed and can't be
 * applied while the server is running
 */
export function GetRestartReasons(
  running: IAgentServerConfig,
  next: IAgentServerConfig,
): string[] {
  const reasons: string[] = [];

  if (running.server.port !== next.server.port) {
    reasons.push('server.port');
  }

  if (running.server.host !== next.server.host) {
    reasons.push('server.host');
  }

  if (running.idl.directory.trim() !== next.idl.directory.trim()) {
    reasons.push('idl.directory');
  }

  if (
    !deepEqual(
      NormalizePaths(running.packages.paths),
      NormalizePaths(next.packages.paths),
    )
  ) {
    reasons.push('packages.paths');
  }

  return reasons;
}
