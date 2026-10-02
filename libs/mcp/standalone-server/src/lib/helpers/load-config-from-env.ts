import { IDL_MCP_LOG } from '@idl/logger';
import { IAgentServerConfig, OpenAIModelConfig } from '@idl/types/agents';

import { LOG_MANAGER } from '../mcp/create-standalone-mcp-server';

/**
 * Check what configuration options should be set dynamically
 */
export function LoadConfigFromEnv(config: IAgentServerConfig) {
  if (process.env.OPENAI_API_KEY && config.agent.llm.model === 'openai') {
    LOG_MANAGER.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: 'Found OpenAI API Key, overriding server config',
    });
    config.agent.llm.model = 'openai';
    (config.agent.llm.config as OpenAIModelConfig).apiKey =
      process.env.OPENAI_API_KEY;
  }
}
