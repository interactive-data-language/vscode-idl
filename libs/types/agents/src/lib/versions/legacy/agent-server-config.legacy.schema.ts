import { z } from 'zod';

export const AgentServerConfigSchema_Legacy = z.object({
  agent: z.object({
    engine: z.enum(['copilot', 'langchain']).optional(),
    llm: z.object({
      config: z.record(z.string(), z.any()),
      model: z.string(),
    }),
    reasoning: z.object({
      effort: z
        .enum(['high', 'low', 'max', 'medium', 'xhigh'])
        .default('medium'),
      summary: z.enum(['concise', 'detailed', 'none']).default('detailed'),
    }),
  }),
  mcp: z.object({
    enviToolBlacklist: z.array(z.string()).optional(),
    enviToolWhitelist: z.array(z.string()).optional(),
    toolBlackList: z.array(z.string()).optional(),
    toolWhitelist: z.array(z.string()).optional(),
  }),
  processing: z.record(z.string(), z.any()).optional(),
  server: z.object({
    host: z.string(),
    language: z.string(),
    port: z.number(),
  }),
  version: z.literal('legacy').optional(),
});

export type IAgentServerConfig_Legacy = z.infer<
  typeof AgentServerConfigSchema_Legacy
>;
