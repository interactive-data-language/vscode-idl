import type { IAgentServerConfig } from '@idl/types/agents';

import { ResolveIDLDirectoryOrProblem } from './resolve-idl-directory';
import type { IConfigProblem } from './validate-config.interface';

/**
 * Checks that we have what we need to start the agents server: a copy of IDL
 * and a usable LLM configuration.
 *
 * Has no side effects, so it is safe to call repeatedly.
 */
export function ValidateConfig(config: IAgentServerConfig): IConfigProblem[] {
  const problems: IConfigProblem[] = [];

  const idl = ResolveIDLDirectoryOrProblem(config);
  if (typeof idl !== 'string') {
    problems.push(idl);
  }

  const llm = config.agent.llm;

  switch (llm.model) {
    case 'ollama':
      if (!llm.config.url || !llm.config.defaultModel) {
        problems.push({
          code: 'LLM_NOT_CONFIGURED',
          message:
            'Ollama requires "agent.llm.config.url" and "agent.llm.config.defaultModel".',
        });
      }
      break;
    case 'openai':
      // the server also accepts the key from the environment
      if (!llm.config.apiKey && !process.env.OPENAI_API_KEY) {
        problems.push({
          code: 'LLM_NOT_CONFIGURED',
          message:
            'OpenAI requires an API key. Set "agent.llm.config.apiKey" or the OPENAI_API_KEY environment variable.',
        });
      }
      break;
    default:
      // copilot can fall back to the signed-in user, so there is nothing to check
      break;
  }

  return problems;
}
