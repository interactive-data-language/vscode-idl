import { z } from 'zod';

/**
 * Static HTTP headers sent with every request to the LLM
 */
const HeadersSchema_1_0_0 = z.record(z.string(), z.string()).default({});

/**
 * GitHub Copilot
 */
const CopilotModelSchema_1_0_0 = z.object({
  config: z.object({
    gitHubToken: z.string().optional().default(''),
    headers: HeadersSchema_1_0_0,
  }),
  model: z.literal('copilot'),
});

/**
 * OpenAI
 */
const OpenAIModelSchema_1_0_0 = z.object({
  config: z.object({
    apiKey: z.string().optional().default(''),
    defaultModel: z.string().default('gpt-5.4'),
    headers: HeadersSchema_1_0_0,
    utilityModel: z.string().default('gpt-5.4-mini'),
  }),
  model: z.literal('openai'),
});

/**
 * Ollama
 */
const OllamaModelSchema_1_0_0 = z.object({
  config: z.object({
    defaultModel: z.string(),
    headers: HeadersSchema_1_0_0,
    maxOutputTokens: z.number(),
    maxPromptTokens: z.number(),
    url: z.string(),
    utilityModel: z.string(),
  }),
  model: z.literal('ollama'),
});

export const AgentServerConfigSchema_1_0_0 = z.object({
  agent: z.object({
    defaultInstructions: z.string().optional(),
    llm: z.discriminatedUnion('model', [
      CopilotModelSchema_1_0_0,
      OpenAIModelSchema_1_0_0,
      OllamaModelSchema_1_0_0,
    ]),
    reasoning: z.object({
      effort: z
        .enum(['high', 'low', 'max', 'medium', 'xhigh'])
        .default('medium'),
      summary: z.enum(['concise', 'detailed', 'none']).default('detailed'),
    }),
    mcp: z.object({
      enviToolBlacklist: z.array(z.string()).default([]),
      enviToolWhitelist: z.array(z.string()).default([]),
      enviToolWorkflowBlacklist: z.array(z.string()).default([]),
      enviToolWorkflowWhitelist: z.array(z.string()).default([]),
      instructionsBlacklist: z.array(z.string()).default([]),
      instructionsWhitelist: z.array(z.string()).default([]),
      mcpToolBlackList: z.array(z.string()).default([]),
      mcpToolWhitelist: z.array(z.string()).default([]),
      skillBlacklist: z.array(z.string()).default([]),
      skillWhitelist: z.array(z.string()).default([]),
    }),
  }),
  idl: z.object({
    /** Folder containing the IDL executable, leave empty to find IDL automatically */
    directory: z.string().default(''),
  }),
  server: z.object({
    host: z.string().default('localhost'),
    language: z.literal('en').default('en'),
    port: z.number().default(3000),
  }),
  version: z.literal('1.0.0').default('1.0.0'),
});

export type IAgentServerConfig_1_0_0 = z.infer<
  typeof AgentServerConfigSchema_1_0_0
>;

export const DEFAULT_AGENT_SERVER_CONFIG_1_0_0: IAgentServerConfig_1_0_0 =
  AgentServerConfigSchema_1_0_0.parse({
    agent: { llm: { config: {}, model: 'openai' }, mcp: {}, reasoning: {} },
    server: { port: 3000 },
  });
