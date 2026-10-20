import { z } from 'zod';

import { ITypedMigrationStep } from '../migrate-agent-server-config.interface';
import { AgentServerConfigSchema_1_0_0 } from './agent-server-config.1.0.0.schema';

/**
 * Migration step from legacy unversioned configs to 1.0.0
 *
 * Builds a brand new config from the legacy one, copying properties over.
 * Obsolete properties (`processing`, `agent.engine`) are not carried forward.
 */
export const MIGRATE_LEGACY_TO_1_0_0: ITypedMigrationStep<'legacy', '1.0.0'> = {
  from: 'legacy',
  migrate: (legacy) => {
    const migrated: z.input<typeof AgentServerConfigSchema_1_0_0> = {
      agent: {
        // legacy config is loosely typed, schema parsing below validates it
        llm: {
          config: { ...legacy.agent?.llm?.config },
          model: legacy.agent?.llm?.model,
        } as z.input<typeof AgentServerConfigSchema_1_0_0>['agent']['llm'],
        reasoning: {
          effort: legacy.agent?.reasoning?.effort,
          summary: legacy.agent?.reasoning?.summary,
        },
        mcp: {
          enviToolBlacklist: legacy.mcp?.enviToolBlacklist,
          enviToolWhitelist: legacy.mcp?.enviToolWhitelist,
          mcpToolBlackList: legacy.mcp?.toolBlackList,
          mcpToolWhitelist: legacy.mcp?.toolWhitelist,
        },
      },
      server: {
        host: legacy.server?.host,
        port: legacy.server?.port,
      },
      version: '1.0.0',
    };

    return AgentServerConfigSchema_1_0_0.parse(migrated);
  },
  schemaTo: AgentServerConfigSchema_1_0_0,
  to: '1.0.0',
};
