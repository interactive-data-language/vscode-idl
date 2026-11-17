import type { IAgentServerConfig } from './agents-server-config.interface';

/**
 * Response for PUT /api/config
 */
export interface IUpdateAgentServerConfigResponse {
  /** The saved configuration */
  config: IAgentServerConfig;
  /** True when saved changes need a server restart to take effect */
  requiresRestart: boolean;
  /** Properties, like "server.port", that differ from what the server is running with */
  restartReasons: string[];
}
