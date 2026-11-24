import type { SessionEvent } from '@github/copilot-sdk';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

import { RegisterMCPTool_LoadToolset } from './mcp-tools/register-mcp-tool-load-toolset';
import { CopilotMCPToolsets } from './mcp-toolsets.class';
import { LOAD_TOOLSET_NAME } from './mcp-toolsets.interface';

function LoadEvents(toolset: string, success: boolean): SessionEvent[] {
  return [
    {
      id: `${toolset}-start`,
      parentId: 'previous-event',
      timestamp: '2026-01-01T00:00:00.000Z',
      type: 'tool.execution_start',
      data: {
        toolName: LOAD_TOOLSET_NAME,
        toolCallId: toolset,
        arguments: { toolset },
      },
    },
    {
      id: `${toolset}-complete`,
      parentId: `${toolset}-start`,
      timestamp: '2026-01-01T00:00:01.000Z',
      type: 'tool.execution_complete',
      data: { toolCallId: toolset, success },
    },
  ];
}

describe('Copilot MCP toolsets', () => {
  const allowedTools = Object.values(MCP_TOOL_LOOKUP);

  it('initially exposes exactly the core MCP tools, not the full catalogue', () => {
    const toolsets = new CopilotMCPToolsets(allowedTools);
    const available = toolsets.getAvailableTools();

    expect(available.filter((tool) => tool.startsWith('mcp:'))).toEqual(
      [
        'list-skills',
        'get-skill',
        'run-idl-code',
        'get-idl-state',
        'search-for-routine',
        'get-routine-docs',
        'control-idl-and-envi-session',
        'search-for-files',
        'create-folder',
        'list-all-resources',
        'search-resources',
        'get-resource',
      ].map((tool) => `mcp:idl-mcp-${tool}`),
    );
    expect(available).toContain('custom:*');
    expect(available).toContain('builtin:view');
    expect(available).not.toContain('mcp:*');
  });

  it('loads modeler with processing once without changing another conversation', async () => {
    const first = new CopilotMCPToolsets(allowedTools);
    const second = new CopilotMCPToolsets(allowedTools);
    const update = jest.fn(async () => undefined);

    const result = await first.load('modeler', update);
    expect(result.loadedToolsets).toEqual([
      'core',
      'envi-processing',
      'modeler',
    ]);
    expect(result.tools).toEqual([
      'idl-mcp-list-envi-tools',
      'idl-mcp-get-envi-tool-parameters',
      'idl-mcp-run-envi-tool',
      'idl-mcp-create-envi-modeler-workflow',
    ]);
    expect(update).toHaveBeenLastCalledWith(first.getAvailableTools());

    await first.load('modeler', update);
    expect(update).toHaveBeenCalledTimes(1);
    expect(second.getAvailableTools()).not.toContain(
      'mcp:idl-mcp-create-envi-modeler-workflow',
    );
  });

  it('serializes concurrent loads so neither filter update loses the other group', async () => {
    const toolsets = new CopilotMCPToolsets(allowedTools);
    const update = jest.fn(async () => {
      await Promise.resolve();
    });

    await Promise.all([
      toolsets.load('envi-display', update),
      toolsets.load('idl-dev', update),
    ]);

    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        'mcp:idl-mcp-open-datasets-in-envi',
        'mcp:idl-mcp-take-envi-screenshot',
        'mcp:idl-mcp-control-idl-debugger',
        'mcp:idl-mcp-run-idl-file',
        'mcp:idl-mcp-create-idl-notebook',
        'mcp:idl-mcp-query-idl-session',
      ]),
    );
    expect(toolsets.getAvailableTools()).not.toContain(
      'mcp:idl-mcp-query-dataset-with-envi',
    );
  });

  it('honors policy for core and loaded tools and reports excluded members', async () => {
    const toolsets = new CopilotMCPToolsets(
      allowedTools.filter(
        (tool) =>
          tool !== 'run-envi-tool' &&
          tool !== 'run-idl-code' &&
          tool !== 'query-dataset-with-envi',
      ),
    );
    const update = jest.fn(async () => undefined);

    const result = await toolsets.load('envi-processing', update);
    expect(result.unavailableTools).toEqual(['run-envi-tool']);
    expect(toolsets.getAvailableTools()).not.toContain(
      'mcp:idl-mcp-run-envi-tool',
    );
    expect(toolsets.getAvailableTools()).not.toContain(
      'mcp:idl-mcp-run-idl-code',
    );

    await expect(toolsets.load('dataset-inspection', update)).rejects.toThrow(
      'no tools enabled',
    );
    expect(update).toHaveBeenCalledTimes(1);

    const blockedDependency = new CopilotMCPToolsets([
      'create-envi-modeler-workflow',
    ]);
    await expect(blockedDependency.load('modeler', update)).rejects.toThrow(
      'Toolset "envi-processing"',
    );
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('rejects unknown groups and only commits a load after a successful update', async () => {
    const toolsets = new CopilotMCPToolsets(allowedTools);
    const update = jest.fn(async () => undefined);

    await expect(toolsets.load('unknown', update)).rejects.toThrow();
    expect(update).not.toHaveBeenCalled();

    update.mockRejectedValueOnce(new Error('SDK update failed'));
    await expect(toolsets.load('dataset-inspection', update)).rejects.toThrow(
      'SDK update failed',
    );
    expect(toolsets.getAvailableTools()).not.toContain(
      'mcp:idl-mcp-query-dataset-with-envi',
    );

    await toolsets.load('dataset-inspection', update);
    expect(toolsets.getAvailableTools()).toContain(
      'mcp:idl-mcp-query-dataset-with-envi',
    );
  });

  it('restores successful loads and dependencies, but not failed or unfinished calls', () => {
    const toolsets = new CopilotMCPToolsets(
      allowedTools.filter((tool) => tool !== 'run-envi-tool'),
    );
    toolsets.restore([
      ...LoadEvents('modeler', true),
      ...LoadEvents('envi-display', false),
      ...LoadEvents('idl-dev', true).slice(0, 1),
    ]);

    expect(toolsets.getAvailableTools()).toEqual(
      expect.arrayContaining([
        'mcp:idl-mcp-create-envi-modeler-workflow',
        'mcp:idl-mcp-list-envi-tools',
        'mcp:idl-mcp-get-envi-tool-parameters',
      ]),
    );
    for (const tool of [
      'run-envi-tool',
      'open-datasets-in-envi',
      'control-idl-debugger',
    ]) {
      expect(toolsets.getAvailableTools()).not.toContain(`mcp:idl-mcp-${tool}`);
    }
  });

  it('returns an explicit failed tool result when the SDK rejects loading', async () => {
    const toolsets = new CopilotMCPToolsets(allowedTools);
    const update = jest.fn(async () => {
      throw new Error('SDK unavailable');
    });
    const tool = RegisterMCPTool_LoadToolset(toolsets, update);
    const log = jest.spyOn(console, 'error').mockImplementation();

    try {
      const result = await tool.handler?.(
        { toolset: 'envi-display' },
        {
          sessionId: 'test-session',
          toolCallId: 'test-call',
          toolName: LOAD_TOOLSET_NAME,
          arguments: { toolset: 'envi-display' },
        },
      );

      expect(result).toEqual({
        resultType: 'failure',
        error: 'SDK unavailable',
        textResultForLlm:
          'Failed to load toolset "envi-display": SDK unavailable',
      });
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
