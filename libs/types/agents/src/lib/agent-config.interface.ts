import { ModelWithConfig } from './model-config.interface';

export interface IAgentConfig {
  /** What LLM do we use */
  llm: ModelWithConfig;
  /** How does the Agent reason through problems? */
  reasoning: {
    /** Effort put into reasoning */
    // manually copy types from github copilot SDK since we cant import
    // eslint-disable-next-line prettier/prettier, perfectionist/sort-union-types
    effort: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
    /** Reasoning summary - detailed let's you see a lot more of thoughts process */
    // manually copy types from github copilot SDK since we cant import
    // eslint-disable-next-line prettier/prettier, perfectionist/sort-union-types
    summary: 'none' | 'concise' | 'detailed';
  };
}
