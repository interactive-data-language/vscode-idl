import type { ChatProvider } from '../config/env.config';

/**
 * Configuration shared by all chat engine implementations.
 */
export interface IChatServiceConfig {
  /** GitHub token used by the Copilot SDK client when `provider === 'copilot'`. */
  copilotGitHubToken?: string;
  /** Base URL of a local Ollama instance (e.g. `http://localhost:11434`). Only used when `provider === 'ollama'`. */
  ollamaBaseUrl?: string;
  /** OpenAI API key — required when `provider === 'openai'`, optional otherwise. */
  openaiApiKey?: string;
  /** Chat provider backend selected via the `CHAT_PROVIDER` env var. */
  provider: ChatProvider;
  /** Port the Express app is listening on (used to wire the local MCP HTTP server). */
  serverPort?: number;
}
