import { IElectronConfig, OpenAIModelConfig } from '@idl/types/electron';

/**
 * Check what configuration options should be set dynamically
 */
export function LoadConfigFromEnv(config: IElectronConfig) {
  if (process.env.OPENAI_API_KEY) {
    console.log('[config] Found OpenAI API Key, overriding server config');
    config.agent.llm.model = 'openai';
    (config.agent.llm.config as OpenAIModelConfig).apiKey =
      process.env.OPENAI_API_KEY;
  }
}
