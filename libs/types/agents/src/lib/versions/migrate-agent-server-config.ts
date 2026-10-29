import { copy } from 'fast-copy';
import { deepEqual } from 'fast-equals';

import {
  CURRENT_AGENT_SERVER_CONFIG_VERSION,
  type IAgentServerConfig,
} from '../agents-server-config.interface';
import {
  AgentServerConfigSchema_1_0_0,
  DEFAULT_AGENT_SERVER_CONFIG_1_0_0,
} from './1.0.0/agent-server-config.1.0.0.schema';
import { MIGRATE_LEGACY_TO_1_0_0 } from './1.0.0/migrate-to-1.0.0';
import type { IMigrateAgentServerConfigResult } from './migrate-agent-server-config.interface';

/**
 * Registered migration steps in sequential order
 */
const MIGRATION_STEPS = [MIGRATE_LEGACY_TO_1_0_0];

/**
 * Auto-migrates an agent server configuration from older formats to the current
 * schema version.
 *
 * If the config is already on the current version and all fields are present,
 * returns `hasChanges: false`.
 *
 * If any migrations were applied, deprecated properties cleaned up, or defaults
 * filled in, returns `hasChanges: true`.
 */
export function MigrateAgentServerConfig(
  rawConfig: any,
): IMigrateAgentServerConfigResult {
  if (
    rawConfig === undefined ||
    typeof rawConfig !== 'object' ||
    rawConfig === null
  ) {
    return {
      config: copy(DEFAULT_AGENT_SERVER_CONFIG_1_0_0),
      hasChanges: true,
    };
  }

  // Unversioned configs are legacy
  let working = copy(rawConfig);
  let version: string = working.version || 'legacy';

  // Each step returns a new config
  for (const step of MIGRATION_STEPS) {
    if (version === step.from) {
      working = step.migrate(working);
      version = step.to;
    }
  }

  // Validate and fill defaults, always targeting the current version
  const parsed = AgentServerConfigSchema_1_0_0.safeParse({
    ...working,
    version: CURRENT_AGENT_SERVER_CONFIG_VERSION,
  });
  if (!parsed.success) {
    console.warn(
      '[Config] Migrated config failed schema validation:',
      parsed.error,
    );
  }

  const config = (parsed.success ? parsed.data : working) as IAgentServerConfig;

  return { config, hasChanges: !deepEqual(rawConfig, config) };
}
