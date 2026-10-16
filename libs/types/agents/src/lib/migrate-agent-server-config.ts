import { copy } from 'fast-copy';

import {
  CURRENT_AGENT_SERVER_CONFIG_VERSION,
  DEFAULT_AGENT_SERVER_CONFIG,
  IAgentServerConfig,
} from './agents-server-config.interface';

/**
 * Result of migrating an agent server configuration
 */
export interface IMigrateAgentServerConfigResult {
  /** The migrated, validated configuration */
  config: IAgentServerConfig;
  /** Whether any schema migrations or default-filling modifications were made */
  hasChanges: boolean;
}

/**
 * Migration step definition for upgrading configs from one version to another
 */
interface IConfigMigrationStep {
  /** Starting version for this step, or undefined for unversioned / legacy configs */
  fromVersion: string | undefined;
  /** Target version for this step */
  toVersion: string;
  /**
   * Performs in-place mutation of the config object.
   * Returns true if any modifications were made.
   */
  migrate: (raw: Record<string, any>) => boolean;
}

/**
 * Migration from legacy (unversioned) format to "1.0.0"
 */
function MigrateToVersion_1_0_0(raw: Record<string, any>): boolean {
  let changed = false;

  // 1. Set version to 1.0.0
  if (raw.version !== '1.0.0') {
    raw.version = '1.0.0';
    changed = true;
  }

  // 2. Ensure mcp object exists
  if (raw.mcp === undefined || typeof raw.mcp !== 'object' || raw.mcp === null) {
    raw.mcp = copy(DEFAULT_AGENT_SERVER_CONFIG.mcp);
    changed = true;
  }

  const mcp = raw.mcp as Record<string, any>;

  // 3. Rename mcp.toolBlackList -> mcp.mcpToolBlackList
  if ('toolBlackList' in mcp) {
    if (mcp.mcpToolBlackList === undefined) {
      mcp.mcpToolBlackList = mcp.toolBlackList;
    }
    delete mcp.toolBlackList;
    changed = true;
  }

  // 4. Rename mcp.toolWhitelist -> mcp.mcpToolWhitelist
  if ('toolWhitelist' in mcp) {
    if (mcp.mcpToolWhitelist === undefined) {
      mcp.mcpToolWhitelist = mcp.toolWhitelist;
    }
    delete mcp.toolWhitelist;
    changed = true;
  }

  // 5. Ensure all required MCP arrays exist and are valid arrays
  const requiredMcpArrays = [
    'enviToolBlacklist',
    'enviToolWhitelist',
    'enviToolWorkflowWhitelist',
    'enviToolWorkflowBlacklist',
    'instructionsWhitelist',
    'instructionsBlacklist',
    'mcpToolWhitelist',
    'mcpToolBlackList',
    'skillWhitelist',
    'skillBlacklist',
  ] as const;

  for (const arrayProp of requiredMcpArrays) {
    if (!Array.isArray(mcp[arrayProp])) {
      mcp[arrayProp] = [];
      changed = true;
    }
  }

  // 6. Strip obsolete top-level properties from older formats (e.g. processing)
  if ('processing' in raw) {
    delete raw.processing;
    changed = true;
  }

  // 7. Strip obsolete agent.engine property
  if (raw.agent !== undefined && typeof raw.agent === 'object' && raw.agent !== null && 'engine' in raw.agent) {
    delete raw.agent.engine;
    changed = true;
  }

  return changed;
}

/**
 * Registered migration steps in sequential order
 */
const MIGRATION_STEPS: IConfigMigrationStep[] = [
  {
    fromVersion: undefined,
    toVersion: '1.0.0',
    migrate: MigrateToVersion_1_0_0,
  },
];

/**
 * Fills in any missing required sections or defaults from DEFAULT_AGENT_SERVER_CONFIG
 */
function EnsureDefaults(raw: Record<string, any>): boolean {
  let changed = false;

  // Ensure agent section exists
  if (raw.agent === undefined || typeof raw.agent !== 'object' || raw.agent === null) {
    raw.agent = copy(DEFAULT_AGENT_SERVER_CONFIG.agent);
    changed = true;
  } else {
    if ('engine' in raw.agent) {
      delete raw.agent.engine;
      changed = true;
    }
    if (raw.agent.llm === undefined || typeof raw.agent.llm !== 'object' || raw.agent.llm === null) {
      raw.agent.llm = copy(DEFAULT_AGENT_SERVER_CONFIG.agent.llm);
      changed = true;
    }
    if (raw.agent.reasoning === undefined || typeof raw.agent.reasoning !== 'object' || raw.agent.reasoning === null) {
      raw.agent.reasoning = copy(DEFAULT_AGENT_SERVER_CONFIG.agent.reasoning);
      changed = true;
    }
  }

  // Ensure server section exists
  if (raw.server === undefined || typeof raw.server !== 'object' || raw.server === null) {
    raw.server = copy(DEFAULT_AGENT_SERVER_CONFIG.server);
    changed = true;
  } else {
    if (raw.server.host === undefined) {
      raw.server.host = DEFAULT_AGENT_SERVER_CONFIG.server.host;
      changed = true;
    }
    if (raw.server.port === undefined) {
      raw.server.port = DEFAULT_AGENT_SERVER_CONFIG.server.port;
      changed = true;
    }
    if (raw.server.language === undefined) {
      raw.server.language = DEFAULT_AGENT_SERVER_CONFIG.server.language;
      changed = true;
    }
  }

  return changed;
}

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
export function MigrateAgentServerConfig(rawConfig: any): IMigrateAgentServerConfigResult {
  if (rawConfig === undefined || typeof rawConfig !== 'object' || rawConfig === null) {
    return {
      config: copy(DEFAULT_AGENT_SERVER_CONFIG),
      hasChanges: true,
    };
  }

  const working = copy(rawConfig) as Record<string, any>;
  let hasChanges = false;

  // Run sequential migrations
  for (const step of MIGRATION_STEPS) {
    if (working.version === step.fromVersion) {
      const stepChanged = step.migrate(working);
      if (stepChanged) {
        hasChanges = true;
      }
    }
  }

  // If still no version (or unknown version), enforce current
  if (working.version !== CURRENT_AGENT_SERVER_CONFIG_VERSION) {
    working.version = CURRENT_AGENT_SERVER_CONFIG_VERSION;
    hasChanges = true;
  }

  // Ensure all baseline sections and default properties are populated
  const defaultsChanged = EnsureDefaults(working);
  if (defaultsChanged) {
    hasChanges = true;
  }

  return {
    config: working as IAgentServerConfig,
    hasChanges,
  };
}
