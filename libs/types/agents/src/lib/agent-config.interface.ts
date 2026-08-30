import { ModelWithConfig } from './model-config.interface';

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
