import { IAgentServerConfig, OpenAIModelConfig } from '@idl/types/agents';

/**
 * Check what configuration options should be set dynamically
 */
export function LoadConfigFromEnv(config: IAgentServerConfig) {
  if (process.env.OPENAI_API_KEY && config.agent.llm.model === 'openai') {
    console.log('[config] Found OpenAI API Key, overriding server config');
    config.agent.llm.model = 'openai';
    (config.agent.llm.config as OpenAIModelConfig).apiKey =
      process.env.OPENAI_API_KEY;
  }
}
