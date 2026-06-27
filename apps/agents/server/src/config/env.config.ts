import { z } from 'zod';

/**
 * Selectable chat provider backend.
 * - `openai`: BYOK — call OpenAI directly using `OPENAI_API_KEY`.
 * - `copilot`: Use GitHub Copilot via the `@github/copilot-sdk` runtime.
 * - `ollama`: Local Ollama instance via its OpenAI-compatible API (no key required).
 */
export type ChatProvider = 'copilot' | 'ollama' | 'openai';

/**
 * Environment variable schema validation
 */
const envSchema = z
  .object({
    /**
     * Chat provider backend. Defaults to `openai` so existing deployments
     * with only `OPENAI_API_KEY` set keep working unchanged.
     */
    CHAT_PROVIDER: z
      .enum(['openai', 'copilot', 'ollama'])
      .optional()
      .default('openai'),

    /**
     * OpenAI API key. Required when `CHAT_PROVIDER=openai`; also used as the
     * title-generation fallback in Copilot mode when present.
     */
    OPENAI_API_KEY: z.string().optional(),

    /**
     * GitHub token for the Copilot SDK client. Optional — when omitted the
     * SDK falls back to the host's logged-in Copilot credentials.
     */
    COPILOT_GITHUB_TOKEN: z.string().optional(),

    /**
     * Base URL of a local Ollama instance. Only used when `CHAT_PROVIDER=ollama`.
     * Defaults to the standard Ollama port.
     */
    OLLAMA_BASE_URL: z.string().optional().default('http://localhost:11434'),

    /**
     * Server host (optional, defaults to localhost)
     */
    HOST: z.string().optional().default('localhost'),

    /**
     * Server port (optional, defaults to 3000)
     */
    PORT: z.string().optional().default('3000'),
  })
  .superRefine((data, ctx) => {
    if (data.CHAT_PROVIDER === 'openai' && !data.OPENAI_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['OPENAI_API_KEY'],
        message: 'OPENAI_API_KEY is required when CHAT_PROVIDER=openai',
      });
    }
  });

/**
 * Validated environment variables
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate and return environment configuration
 *
 * @throws {z.ZodError} If validation fails
 */
export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      console.error(
        '\n💡 Set CHAT_PROVIDER (openai|copilot|ollama) plus the matching auth env var (OPENAI_API_KEY for openai, optional COPILOT_GITHUB_TOKEN for copilot, optional OLLAMA_BASE_URL for ollama).',
      );
      process.exit(1);
    }
    throw error;
  }
}
