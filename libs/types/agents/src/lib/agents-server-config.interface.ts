import { IAgentConfig } from './agent-config.interface';
import { IAgentsMCPConfig } from './mcp-config.interface';
import { IServerConfig } from './server-config.interface';

/** Configuration for the standalone agents server (Electron main process, desktop app, or CLI) */
export interface IAgentServerConfig {
  /** Configuration for our chat */
  agent: IAgentConfig;
  /** Config for MCP tools */
  mcp: IAgentsMCPConfig;
  /** Config for HTTP server */
  server: IServerConfig;
}

// /**
//  * Default config for the agents server
//  */
// export const DEFAULT_AGENT_SERVER_CONFIG: IAgentServerConfig = {
//   agent: {
//     engine: 'copilot',
//     llm: {
//       model: 'openai',
//       config: {
//         apiKey: '',
//         defaultModel: 'gpt-5.4',
//         utilityModel: 'gpt-5.4-mini',
//       },
//     },
//     reasoning: {
//       effort: 'medium',
//       summary: 'detailed',
//     },
//   },
//   mcp: {
//     enviToolBlacklist: [],
//     enviToolWhitelist: [],
//     toolBlackList: [
//     ],
//     toolWhitelist: [],
//   },
//   server: {
//     host: 'localhost',
//     port: 4142,
//     language: 'en',
//   },
// };

/**
 * Default config for the agents server
 */
export const DEFAULT_AGENT_SERVER_CONFIG: IAgentServerConfig = {
  agent: {
    engine: 'copilot',
    llm: {
      model: 'ollama',
      config: {
        url: 'http://10.111.139.49:11434',
        defaultModel: 'gemma4:26b',
        utilityModel: 'gemma4:26b',
        maxPromptTokens: 110000,
        maxOutputTokens: 18000,
      },
    },
    reasoning: {
      effort: 'medium',
      summary: 'detailed',
    },
  },
  mcp: {
    enviToolBlacklist: [],
    enviToolWhitelist: [],
    toolBlackList: [
      'control-idl-debugger',
      'create-idl-notebook',
      'create-envi-modeler-workflow',
      'get-idl-state',
      'get-routine-docs',
      'query-idl-session',
      'run-idl-code',
      'run-idl-file',
    ],
    toolWhitelist: [],
  },
  server: {
    host: 'localhost',
    port: 4142,
    language: 'en',
  },
};
