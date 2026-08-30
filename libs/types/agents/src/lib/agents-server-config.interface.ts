import { IAgentConfig } from './agent-config.interface';
import { ProcessingModeWithConfig } from './processing-config.interface';
import { IServerConfig } from './server-config.interface';

/** Configuration for the standalone agents server (Electron main process, desktop app, or CLI) */
export interface IAgentServerConfig {
  /** Configuration for our chat */
  agent: IAgentConfig;
  /** Processing config */
  processing: ProcessingModeWithConfig;
  /** Config for HTTP server */
  server: IServerConfig;
}

/**
 * Default config for the agents server
 */
export const DEFAULT_AGENT_SERVER_CONFIG: IAgentServerConfig = {
  agent: {
    engine: 'copilot',
    llm: {
      model: 'openai',
      config: {
        apiKey: '',
        defaultModel: 'gpt-5.4',
        utilityModel: 'gpt-5.4-mini',
      },
    },
  },
  processing: {
    mode: 'idl-machine',
    config: {},
  },
  server: {
    host: 'localhost',
    port: 4142,
    language: 'en',
  },
};
