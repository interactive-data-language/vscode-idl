import {
  type IAgentServerConfig,
  MigrateAgentServerConfig,
} from '@idl/types/agents';
import merge from 'deepmerge';

import { SaveConfig } from './load-config';

/**
 * Deep-merges a partial config into the current config, fills defaults,
 * saves the result to disk, and returns it.
 *
 * Arrays in the patch replace the existing arrays instead of being concatenated.
 */
export function UpdateConfig(
  current: IAgentServerConfig,
  patch: Record<string, unknown>,
  filePath?: string,
): IAgentServerConfig {
  const merged = merge(current, patch, {
    arrayMerge: (_target, source) => source,
  });

  const { config } = MigrateAgentServerConfig(merged);

  SaveConfig(config, filePath);

  return config;
}
