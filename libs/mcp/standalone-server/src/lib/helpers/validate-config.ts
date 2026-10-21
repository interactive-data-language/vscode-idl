import type { IAgentServerConfig } from '@idl/types/agents';

import { ResolveIDLDirectory } from './resolve-idl-directory';
import { IConfigProblem } from './validate-config.interface';

/**
 * Checks that we have what we need to start the agents server: a copy of IDL
 * and a usable LLM configuration.
 *
 * Has no side effects, so it is safe to call repeatedly.
 */
export function ValidateConfig(config: IAgentServerConfig): IConfigProblem[] {
  const problems: IConfigProblem[] = [];

  if (ResolveIDLDirectory(config) === undefined) {
    const directory = config.idl.directory.trim();

    problems.push(
      directory !== ''
        ? {
            code: 'IDL_DIRECTORY_INVALID',
            message: `"idl.directory" does not contain an IDL executable: ${directory}`,
          }
        : {
            code: 'IDL_NOT_FOUND',
            message:
              'Unable to find IDL. Install IDL, set "idl.directory", or set the IDL_DIR environment variable.',
          },
    );
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
