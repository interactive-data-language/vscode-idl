import { FindIDL, ValidateIDLDir } from '@idl/idl/files';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';

import { ValidateConfig } from './validate-config';

jest.mock('@idl/idl/files', () => ({
  FindIDL: jest.fn(),
  ValidateIDLDir: jest.fn(),
}));

/** Default config with an OpenAI key set */
function ConfigWithKey() {
  const config = copy(DEFAULT_AGENT_SERVER_CONFIG);
  config.agent.llm = {
    model: 'openai',
    config: {
      apiKey: 'abc',
      defaultModel: 'a',
      headers: {},
      utilityModel: 'b',
    },
  };
  return config;
}

describe('ValidateConfig', () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    (FindIDL as jest.Mock).mockReset().mockReturnValue('/path/to/idl');
    (ValidateIDLDir as jest.Mock).mockReset();
  });

  afterAll(() => {
    if (originalKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalKey;
    }
  });

  it('reports a missing IDL install', () => {
    (FindIDL as jest.Mock).mockReturnValue(undefined);

    expect(ValidateConfig(ConfigWithKey()).map((p) => p.code)).toEqual([
      'IDL_NOT_FOUND',
    ]);
  });

  it('uses a valid configured IDL directory without searching', () => {
    (FindIDL as jest.Mock).mockReturnValue(undefined);
    (ValidateIDLDir as jest.Mock).mockReturnValue(true);
    const config = ConfigWithKey();
    config.idl.directory = '/custom/idl/bin';

    expect(ValidateConfig(config)).toEqual([]);
    expect(FindIDL).not.toHaveBeenCalled();
  });

  it('reports an invalid configured IDL directory without falling back', () => {
    (ValidateIDLDir as jest.Mock).mockReturnValue(false);
    const config = ConfigWithKey();
    config.idl.directory = '/custom/idl/bin';

    expect(ValidateConfig(config).map((p) => p.code)).toEqual([
      'IDL_DIRECTORY_INVALID',
    ]);
    expect(FindIDL).not.toHaveBeenCalled();
  });

  it('reports an OpenAI config without an API key', () => {
    const config = copy(DEFAULT_AGENT_SERVER_CONFIG);

    expect(ValidateConfig(config).map((p) => p.code)).toEqual([
      'LLM_NOT_CONFIGURED',
    ]);
  });

  it('accepts an OpenAI key from the environment', () => {
    process.env.OPENAI_API_KEY = 'abc';

    expect(ValidateConfig(copy(DEFAULT_AGENT_SERVER_CONFIG))).toEqual([]);
  });

  it('reports an Ollama config without a url', () => {
    const config = copy(DEFAULT_AGENT_SERVER_CONFIG);
    config.agent.llm = {
      model: 'ollama',
      config: {
        defaultModel: 'llama',
        headers: {},
        maxOutputTokens: 1,
        maxPromptTokens: 1,
        url: '',
        utilityModel: 'llama',
      },
    };

    expect(ValidateConfig(config).map((p) => p.code)).toEqual([
      'LLM_NOT_CONFIGURED',
    ]);
  });

  it('has no problems for a valid config', () => {
    expect(ValidateConfig(ConfigWithKey())).toEqual([]);
  });
});
