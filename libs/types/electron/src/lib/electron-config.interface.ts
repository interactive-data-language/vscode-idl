import { ModelWithConfig } from './model-config.interface';
import { ProcessingModeWithConfig } from './processing-config.interface';

/**
 * Selectable chat provider backend.
 * - `openai`: BYOK — call OpenAI directly using `OPENAI_API_KEY`.
 * - `copilot`: Use GitHub Copilot via the `@github/copilot-sdk` runtime.
 * - `ollama`: Local Ollama instance via its OpenAI-compatible API (no key required).
 */
export type ChatProvider = 'copilot' | 'ollama' | 'openai';

/**
 * Selectable chat engine.
 * - `copilot`: Use the `@github/copilot-sdk` agentic runtime (disk-backed sessions).
 * - `langchain`: Use LangChain + OpenAI-compatible client (stateless per-request; works with Ollama).
 */
export type ChatEngine = 'copilot' | 'langchain';

export interface IAgentConfig {
  /** Chat engine (orchestrator) */
  engine: ChatEngine;
  /** What LLM do we use */
  llm: ModelWithConfig;
}

/**
 * Configuration for the server
 */
export interface IServerConfig {
  /** Server host */
  host: string;
  /** TCP port the embedded agents server is listening on */
  port: number;
}

/** Configuration shared between the Electron main process and the Angular renderer */
export interface IElectronConfig {
  /** Configuration for our chat */
  agent: IAgentConfig;
  /** Processing config */
  processing: ProcessingModeWithConfig;
  /** Config for HTTP server */
  server: IServerConfig;
}

/**
 * Default config for our electron app
 */
export const DEFAULT_ELECTRON_CONFIG: IElectronConfig = {
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
  },
};
