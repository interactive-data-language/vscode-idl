import { z } from 'zod';

import {
  AgentServerConfig,
  AgentServerConfigVersion,
  AnyAgentServerConfigVersion,
  IAgentServerConfig,
} from '../agents-server-config.interface';

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
 * Strictly typed migration step definition for upgrading configs from one version to another
 */
export interface ITypedMigrationStep<
  TFromVersion extends AnyAgentServerConfigVersion,
  TToVersion extends AgentServerConfigVersion,
> {
  /** Source schema version */
  from: TFromVersion;
  /** Pure transform that builds and returns a new target config without mutating the source */
  migrate: (
    from: Readonly<AgentServerConfig<TFromVersion>>,
  ) => AgentServerConfig<TToVersion>;
  /** Zod schema validating target config */
  schemaTo: z.ZodType<AgentServerConfig<TToVersion>>;
  /** Target schema version */
  to: TToVersion;
}
