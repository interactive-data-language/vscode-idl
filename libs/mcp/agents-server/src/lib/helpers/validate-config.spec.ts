import { IDL_DIRS } from '@idl/idl/files';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { platform, tmpdir } from 'os';
import { join } from 'path';

import { ValidateConfig } from './validate-config';

// Do not let installs registered on the test machine affect discovery.
jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  execFileSync: jest.fn(() => ''),
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
  let root: string;

  function InstallIDL(folder: string): string {
    const directory = join(root, folder, 'bin');
    mkdirSync(directory, { recursive: true });
    writeFileSync(
      join(directory, platform() === 'win32' ? 'idl.exe' : 'idl'),
      '',
    );
    return directory;
  }

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'agents-validation-'));
    jest.replaceProperty(IDL_DIRS, platform(), [InstallIDL('IDL92')]);
    jest.replaceProperty(process, 'env', { ...process.env });
    delete process.env.OPENAI_API_KEY;
    delete process.env.IDL_DIR;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    rmSync(root, { recursive: true, force: true });
  });

  it('reports that IDL 9.2+ is not found when only an old install can be discovered', () => {
    IDL_DIRS[platform()] = [InstallIDL('IDL91')];

    expect(ValidateConfig(ConfigWithKey())).toEqual([
      { code: 'IDL_NOT_FOUND', message: expect.stringContaining('9.2+') },
    ]);
  });

  it('reports the configured old executable directory instead of using a newer install', () => {
    const config = ConfigWithKey();
    config.idl.directory = InstallIDL('IDL91');

    const problems = ValidateConfig(config);
    expect(problems).toEqual([
      {
        code: 'IDL_VERSION_UNSUPPORTED',
        message: expect.stringContaining(config.idl.directory),
      },
    ]);
    expect(problems[0].message).toContain('9.2+');
  });

  it('also checks the directory resolved by the IDL_DIR fallback', () => {
    IDL_DIRS[platform()] = [];
    const bin = InstallIDL('IDL89');
    process.env.IDL_DIR = platform() === 'win32' ? bin : join(root, 'IDL89');

    expect(ValidateConfig(ConfigWithKey())).toEqual([
      {
        code: 'IDL_VERSION_UNSUPPORTED',
        message: expect.stringContaining(bin),
      },
    ]);
  });

  it('accepts a custom-named directory with an executable and no known version', () => {
    IDL_DIRS[platform()] = [];
    const config = ConfigWithKey();
    config.idl.directory = InstallIDL('custom-runtime');
    expect(ValidateConfig(config)).toEqual([]);
  });

  it('reports an invalid configured IDL directory without falling back', () => {
    const config = ConfigWithKey();
    config.idl.directory = root;

    expect(ValidateConfig(config).map((p) => p.code)).toEqual([
      'IDL_DIRECTORY_INVALID',
    ]);
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
