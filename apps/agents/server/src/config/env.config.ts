import { z } from 'zod';

/**
 * Environment variable schema validation
 */
const envSchema = z.object({
  /**
   * OpenAI API key for LangChain chat completions
   */
  OPENAI_API_KEY: z
    .string()
    .min(1, 'OPENAI_API_KEY environment variable is required'),

  /**
   * Server host (optional, defaults to localhost)
   */
  HOST: z.string().optional().default('localhost'),

  /**
   * Server port (optional, defaults to 3000)
   */
  PORT: z.string().optional().default('3000'),
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
        '\n💡 Make sure to set OPENAI_API_KEY in your environment or .env file',
      );
      process.exit(1);
    }
    throw error;
  }
}
