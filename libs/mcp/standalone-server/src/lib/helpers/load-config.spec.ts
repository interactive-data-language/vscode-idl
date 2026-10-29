import {
  type AgentServerConfig,
  DEFAULT_AGENT_SERVER_CONFIG,
  type IAgentServerConfig,
  MIGRATE_LEGACY_TO_1_0_0,
  MigrateAgentServerConfig,
} from '@idl/types/agents';
import { copy } from 'fast-copy';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { LoadConfig } from './load-config';

describe('Agent Server Config Migration and Loading', () => {
  const tempDir = join(__dirname, '__temp_config_test__');
  const tempConfigFile = join(tempDir, 'desktop-agents.config.json');

  beforeEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('MigrateAgentServerConfig', () => {
    it('migrates a legacy unversioned config to version 1.0.0', () => {
      const before = {
        agent: {
          engine: 'copilot',
          llm: {
            model: 'ollama',
            config: {
              url: 'http://10.111.139.49:11434',
              defaultModel: 'gemma4:26b',
              utilityModel: 'gemma4:26b',
              maxPromptTokens: 110000,
              maxOutputTokens: 18000,
            },
          },
          reasoning: {
            effort: 'medium',
            summary: 'detailed',
          },
        },
        mcp: {
          enviToolBlacklist: [],
          enviToolWhitelist: ['ImageIntersection', 'SpectralIndex'],
          toolBlackList: ['run-idl-code', 'run-idl-file'],
          toolWhitelist: ['create-folder'],
        },
        processing: {
          mode: 'idl-machine',
          config: {},
        },
        server: {
          host: 'localhost',
          language: 'en',
          port: 3000,
        },
      };

      const expectedAfter: IAgentServerConfig = {
        agent: {
          llm: {
            model: 'ollama',
            config: {
              url: 'http://10.111.139.49:11434',
              defaultModel: 'gemma4:26b',
              headers: {},
              utilityModel: 'gemma4:26b',
              maxPromptTokens: 110000,
              maxOutputTokens: 18000,
            },
          },
          reasoning: {
            effort: 'medium',
            summary: 'detailed',
          },
          mcp: {
            enviToolBlacklist: [],
            enviToolWhitelist: ['ImageIntersection', 'SpectralIndex'],
            enviToolWorkflowBlacklist: [],
            enviToolWorkflowWhitelist: [],
            instructionsBlacklist: [],
            instructionsWhitelist: [],
            mcpToolBlackList: ['run-idl-code', 'run-idl-file'],
            mcpToolWhitelist: ['create-folder'],
            skillBlacklist: [],
            skillWhitelist: [],
          },
        },
        idl: { directory: '' },
        server: {
          host: 'localhost',
          language: 'en',
          port: 3000,
        },
        version: '1.0.0',
      };

      const result = MigrateAgentServerConfig(before);

      expect(result.hasChanges).toBe(true);
      expect(result.config).toEqual(expectedAfter);
    });

    it('returns hasChanges=false when config is already up-to-date 1.0.0', () => {
      const upToDateConfig: IAgentServerConfig = copy(
        DEFAULT_AGENT_SERVER_CONFIG,
      );

      const result = MigrateAgentServerConfig(upToDateConfig);

      expect(result.hasChanges).toBe(false);
      expect(result.config).toEqual(DEFAULT_AGENT_SERVER_CONFIG);
    });

    it('handles undefined or invalid input gracefully', () => {
      const result = MigrateAgentServerConfig(undefined);

      expect(result.hasChanges).toBe(true);
      expect(result.config).toEqual(DEFAULT_AGENT_SERVER_CONFIG);
    });

    it('migrates using the typed MIGRATE_LEGACY_TO_1_0_0 step and validates with Zod', () => {
      const legacy: AgentServerConfig<'legacy'> = {
        agent: {
          engine: 'copilot',
          llm: {
            config: {
              defaultModel: 'gemma4:26b',
              maxOutputTokens: 2000,
              maxPromptTokens: 10000,
              url: 'http://localhost:11434',
              utilityModel: 'gemma4:26b',
            },
            model: 'ollama',
          },
          reasoning: {
            effort: 'medium',
            summary: 'detailed',
          },
        },
        mcp: {
          toolBlackList: ['run-idl-code'],
          toolWhitelist: ['create-folder'],
        },
        server: {
          host: 'localhost',
          language: 'en',
          port: 3000,
        },
      };

      const migrated = MIGRATE_LEGACY_TO_1_0_0.migrate(legacy);
      const validation = MIGRATE_LEGACY_TO_1_0_0.schemaTo.safeParse(migrated);

      expect(validation.success).toBe(true);
      expect(migrated.version).toBe('1.0.0');
      expect(migrated.agent.mcp.mcpToolBlackList).toEqual(['run-idl-code']);
      expect(migrated.agent.mcp.mcpToolWhitelist).toEqual(['create-folder']);
      expect(migrated.agent.llm.config.headers).toEqual({});
    });

    it('preserves statically configured headers', () => {
      const config = copy(DEFAULT_AGENT_SERVER_CONFIG);
      config.agent.llm.config.headers = { 'x-test': 'a' };

      const result = MigrateAgentServerConfig(config);

      expect(result.hasChanges).toBe(false);
      expect(result.config.agent.llm.config.headers).toEqual({ 'x-test': 'a' });
    });
  });

  describe('LoadConfig and SaveConfig', () => {
    it('returns default config without writing to disk if file does not exist', async () => {
      const missingFile = join(tempDir, 'does-not-exist.json');
      const loaded = await LoadConfig(missingFile);

      expect(loaded).toEqual(DEFAULT_AGENT_SERVER_CONFIG);
      expect(existsSync(missingFile)).toBe(false);
    });

    it('migrates existing legacy file and writes updates to disk', async () => {
      const before = {
        agent: {
          engine: 'copilot',
          llm: {
            model: 'openai',
            config: {
              apiKey: 'test-key',
              defaultModel: 'gpt-5.4',
              utilityModel: 'gpt-5.4-mini',
            },
          },
          reasoning: {
            effort: 'medium',
            summary: 'detailed',
          },
        },
        mcp: {
          enviToolBlacklist: [],
          enviToolWhitelist: [],
          toolBlackList: ['run-idl-code'],
          toolWhitelist: [],
        },
        server: {
          host: 'localhost',
          language: 'en',
          port: 4142,
        },
      };

      const expectedAfter: IAgentServerConfig = {
        agent: {
          llm: {
            model: 'openai',
            config: {
              apiKey: 'test-key',
              defaultModel: 'gpt-5.4',
              headers: {},
              utilityModel: 'gpt-5.4-mini',
            },
          },
          reasoning: {
            effort: 'medium',
            summary: 'detailed',
          },
          mcp: {
            enviToolBlacklist: [],
            enviToolWhitelist: [],
            enviToolWorkflowBlacklist: [],
            enviToolWorkflowWhitelist: [],
            instructionsBlacklist: [],
            instructionsWhitelist: [],
            mcpToolBlackList: ['run-idl-code'],
            mcpToolWhitelist: [],
            skillBlacklist: [],
            skillWhitelist: [],
          },
        },
        idl: { directory: '' },
        server: {
          host: 'localhost',
          language: 'en',
          port: 4142,
        },
        version: '1.0.0',
      };

      writeFileSync(tempConfigFile, JSON.stringify(before, null, 2), 'utf-8');

      const loaded = await LoadConfig(tempConfigFile);
      expect(loaded).toEqual(expectedAfter);

      // Verify the file on disk was also updated to match expectedAfter
      const onDisk = JSON.parse(readFileSync(tempConfigFile, 'utf-8'));
      expect(onDisk).toEqual(expectedAfter);
    });
  });
});
