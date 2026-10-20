/**
 * Released configuration versions
 */
export type AgentServerConfigVersion = '1.0.0';

/**
 * All known versions, including the legacy unversioned state
 */
export type AnyAgentServerConfigVersion = 'legacy' | AgentServerConfigVersion;

/**
 * Latest configuration version
 */
export type AgentServerConfigLatestVersion = AgentServerConfigVersion;

/**
 * Active/latest schema version
 */
export const CURRENT_AGENT_SERVER_CONFIG_VERSION: AgentServerConfigLatestVersion =
  '1.0.0';
