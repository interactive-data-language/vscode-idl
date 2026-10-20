import {
  DEFAULT_AGENT_SERVER_CONFIG_1_0_0,
  IAgentServerConfig_1_0_0,
} from './versions/1.0.0/agent-server-config.1.0.0.schema';
import {
  AgentServerConfigLatestVersion,
  AnyAgentServerConfigVersion,
} from './versions/agent-server-config-version.type';
import { IAgentServerConfig_Legacy } from './versions/legacy/agent-server-config.legacy.schema';

export * from './versions/agent-server-config-version.type';

/**
 * Generic configuration mapping a version identifier to its specific schema type
 */
export type AgentServerConfig<
  TVersion extends AnyAgentServerConfigVersion = AgentServerConfigLatestVersion,
> = TVersion extends '1.0.0'
  ? IAgentServerConfig_1_0_0
  : TVersion extends 'legacy'
    ? IAgentServerConfig_Legacy
    : never;

/**
 * Configuration for the standalone agents server (targeting latest schema)
 */
export type IAgentServerConfig =
  AgentServerConfig<AgentServerConfigLatestVersion>;

/**
 * Default config for the agents server
 */
export const DEFAULT_AGENT_SERVER_CONFIG: IAgentServerConfig =
  DEFAULT_AGENT_SERVER_CONFIG_1_0_0;
