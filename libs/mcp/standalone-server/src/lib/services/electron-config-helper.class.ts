import type { IElectronConfig } from '@idl/types/electron';

/**
 * Wraps `IElectronConfig` and exposes the derived, provider-specific values
 * needed by chat engine implementations (Copilot SDK, LangChain), so engines
 * don't each re-implement the same `llm.model` narrowing logic.
 */
export class ElectronConfigHelper {
  /** Chat engine (orchestrator) selected for this session */
  get chatEngine(): IElectronConfig['agent']['engine'] {
    return this.config.agent.engine;
  }

  /** GitHub token for the Copilot SDK client, when the `copilot` provider is selected */
  get copilotGitHubToken(): string | undefined {
    const { llm } = this.config.agent;
    return llm.model === 'copilot' ? llm.config.gitHubToken : undefined;
  }

  /** Base URL of the Ollama instance to use, defaulting to the standard local port */
  get ollamaBaseUrl(): string {
    const { llm } = this.config.agent;
    return llm.model === 'ollama' ? llm.config.url : 'http://localhost:11434';
  }

  /** OpenAI API key, when the `openai` provider is selected */
  get openaiApiKey(): string | undefined {
    const { llm } = this.config.agent;
    return llm.model === 'openai' ? llm.config.apiKey : undefined;
  }

  /** Selected chat provider backend */
  get provider(): IElectronConfig['agent']['llm']['model'] {
    return this.config.agent.llm.model;
  }

  /** Port the co-hosted Express/MCP server is listening on */
  get serverPort(): number {
    return this.config.server.port;
  }

  /** Whether tool execution is routed through the WebSocket bridge */
  get websocketMode(): boolean {
    return this.config.processing.mode === 'websocket';
  }

  private readonly config: IElectronConfig;

  constructor(config: IElectronConfig) {
    this.config = config;
  }
}
