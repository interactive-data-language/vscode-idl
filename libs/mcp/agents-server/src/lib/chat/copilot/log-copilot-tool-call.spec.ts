import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { LogCopilotToolCall } from './log-copilot-tool-call';

describe('Copilot tool-call log', () => {
  let directory: string;
  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'idl-tool-log-'));
    jest.replaceProperty(process, 'env', {
      ...process.env,
      APPDATA: directory,
      IDL_AGENT_TOOL_LOG: join(directory, 'logs', 'tool-calls.jsonl'),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    rmSync(directory, { recursive: true, force: true });
  });

  it('writes directly in the roaming desktop app folder by default', () => {
    delete process.env.IDL_AGENT_TOOL_LOG;
    LogCopilotToolCall('load-toolset');
    const file = join(directory, 'envi-desktop-agent-dev', 'tool-calls.jsonl');
    expect(JSON.parse(readFileSync(file, 'utf8')).tool).toBe('load-toolset');
  });

  it('creates the directory and appends every call, including duplicates, with only time and name', () => {
    const tools = [
      'view',
      'load-toolset',
      'idl-mcp-get-resource',
      'idl-mcp-get-resource',
    ];
    for (const tool of tools) {
      LogCopilotToolCall(tool);
    }

    const records = readFileSync(
      join(directory, 'logs', 'tool-calls.jsonl'),
      'utf8',
    )
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    expect(records).toEqual(
      tools.map((tool) => ({
        timestamp: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ),
        tool,
      })),
    );
  });

  it('preserves existing records and escapes newlines into a single JSON record', () => {
    const file = join(directory, 'existing.jsonl');
    process.env.IDL_AGENT_TOOL_LOG = file;
    const previous = '{"timestamp":"previous-run","tool":"previous-tool"}\n';
    writeFileSync(file, previous);

    LogCopilotToolCall('tool\nname');

    const content = readFileSync(file, 'utf8');
    expect(content.startsWith(previous)).toBe(true);
    const lines = content.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[1]).tool).toBe('tool\nname');
  });

  it('reports a write failure without interrupting chat', () => {
    process.env.IDL_AGENT_TOOL_LOG = directory;
    const log = jest.spyOn(console, 'error').mockImplementation();
    try {
      expect(() => LogCopilotToolCall('view')).not.toThrow();
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining(directory),
        expect.objectContaining({ code: 'EISDIR' }),
      );
    } finally {
      log.mockRestore();
    }
  });
});
