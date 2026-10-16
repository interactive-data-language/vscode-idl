import { IAgentConfig } from './agent-config.interface';
import { IAgentsMCPConfig } from './mcp-config.interface';
import { IServerConfig } from './server-config.interface';

/** First version of the agents server config */
export type AgentServerConfigVersion_1_0_0 = '1.0.0';

/** Allowed versions of the agents server config */
export type AgentServerConfigVersion = AgentServerConfigVersion_1_0_0;

/** Current version of the agents server config */
export const CURRENT_AGENT_SERVER_CONFIG_VERSION: AgentServerConfigVersion =
  '1.0.0';

/** Configuration for the standalone agents server (Electron main process, desktop app, or CLI) */
export interface IAgentServerConfig {
  /** Configuration for our chat */
  agent: IAgentConfig;
  /** Config for MCP tools */
  mcp: IAgentsMCPConfig;
  /** Config for HTTP server */
  server: IServerConfig;
  /** Version of the configuration schema */
  version: AgentServerConfigVersion;
}

/**
 * Default config for the agents server
 */
export const DEFAULT_AGENT_SERVER_CONFIG: IAgentServerConfig = {
  agent: {
    llm: {
      model: 'openai',
      config: {
        apiKey: '',
        defaultModel: 'gpt-5.4',
        utilityModel: 'gpt-5.4-mini',
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
    enviToolWorkflowWhitelist: [],
    enviToolWorkflowBlacklist: [],
    mcpToolBlackList: [],
    mcpToolWhitelist: [],
    instructionsWhitelist: [],
    instructionsBlacklist: [],
    skillWhitelist: [],
    skillBlacklist: [],
  },
  server: {
    host: 'localhost',
    port: 4142,
    language: 'en',
  },
  version: CURRENT_AGENT_SERVER_CONFIG_VERSION,
};

// /**
//  * Default config for the agents server
//  */
// export const DEFAULT_AGENT_SERVER_CONFIG: IAgentServerConfig = {
//   agent: {
//     llm: {
//       model: 'ollama',
//       config: {
//         url: 'http://10.111.139.49:11434',
//         defaultModel: 'gemma4:26b',
//         utilityModel: 'gemma4:26b',
//         maxPromptTokens: 110000,
//         maxOutputTokens: 18000,
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
//       'control-idl-debugger',
//       'create-idl-notebook',
//       'create-envi-modeler-workflow',
//       'get-idl-state',
//       'get-routine-docs',
//       'query-idl-session',
//       'run-idl-code',
//       'run-idl-file',
//     ],
//     toolWhitelist: [],
//     instructionsWhitelist: [],
//     instructionsBlacklist: [],
//     skillWhitelist: [],
//     skillBlacklist: [],
//     toolWorkflowWhitelist: [],
//     toolWorkflowBlacklist: [],
//   },
//   server: {
//     host: 'localhost',
//     port: 4142,
//     language: 'en',
//   },
// };
