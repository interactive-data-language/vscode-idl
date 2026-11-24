import { MCP_TOOL_LOOKUP, type MCPTools } from '@idl/types/mcp';
import { z } from 'zod';

/** Custom tool that exposes deferred MCP tools to an agent conversation. */
export const LOAD_TOOLSET_NAME = 'load-toolset';

/** Optional toolsets that can be loaded during a conversation. */
export const MCP_TOOLSET_NAMES = [
  'dataset-inspection',
  'envi-display',
  'envi-processing',
  'modeler',
  'workflow-recipes',
  'idl-dev',
] as const;

/** Name of a deferred toolset. */
export type MCPToolsetName = (typeof MCP_TOOLSET_NAMES)[number];

/** Parameters shared by the loader and persisted-call restoration. */
export const LOAD_TOOLSET_PARAMETERS = z.object({
  toolset: z.enum(MCP_TOOLSET_NAMES).describe('The toolset to load.'),
});

/** MCP tools exposed before any optional toolsets are loaded. */
export const MCP_CORE_TOOLS: readonly MCPTools[] = [
  MCP_TOOL_LOOKUP.LIST_SKILLS,
  MCP_TOOL_LOOKUP.GET_SKILL,
  MCP_TOOL_LOOKUP.RUN_IDL_CODE,
  MCP_TOOL_LOOKUP.GET_IDL_STATE,
  MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE,
  MCP_TOOL_LOOKUP.GET_ROUTINE_DOCS,
  MCP_TOOL_LOOKUP.CONTROL_IDL_AND_ENVI_SESSION,
  MCP_TOOL_LOOKUP.SEARCH_FOR_FILES,
  MCP_TOOL_LOOKUP.CREATE_FOLDER,
  MCP_TOOL_LOOKUP.LIST_ALL_RESOURCES,
  MCP_TOOL_LOOKUP.SEARCH_RESOURCES,
  MCP_TOOL_LOOKUP.GET_RESOURCE,
];

/** Tools and dependencies exposed together by the loader. */
interface IMCPToolsetDefinition {
  /** Other toolsets that must be loaded first. */
  dependencies: readonly MCPToolsetName[];
  /** Short discovery description presented by load-toolset. */
  description: string;
  /** MCP tool names, without the runtime's server prefix. */
  tools: readonly MCPTools[];
}

/** Deferred MCP toolsets for agent-server conversations. */
export const MCP_TOOLSETS: Record<MCPToolsetName, IMCPToolsetDefinition> = {
  'dataset-inspection': {
    dependencies: [],
    description: 'Inspect dataset metadata, ROIs, spectra, and ML models.',
    tools: [MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI],
  },
  'envi-display': {
    dependencies: [],
    description: 'Display datasets in ENVI and capture the display.',
    tools: [
      MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
      MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT,
    ],
  },
  'envi-processing': {
    dependencies: [],
    description:
      'Discover ENVI tasks, retrieve parameters, and run processing.',
    tools: [
      MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS,
      MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS,
      MCP_TOOL_LOOKUP.RUN_ENVI_TOOL,
    ],
  },
  modeler: {
    dependencies: ['envi-processing'],
    description:
      'Create ENVI Modeler graphs. Also loads envi-processing for task discovery and parameters.',
    tools: [MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW],
  },
  'workflow-recipes': {
    dependencies: [],
    description: 'Find, retrieve, and save reusable workflow instructions.',
    tools: [
      MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
      MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW,
      MCP_TOOL_LOOKUP.SAVE_ENVI_TOOL_WORKFLOW,
    ],
  },
  'idl-dev': {
    dependencies: [],
    description:
      'Control breakpoints and stepping, query the current IDL scope, run files, and create notebooks.',
    tools: [
      MCP_TOOL_LOOKUP.CONTROL_IDL_DEBUGGER,
      MCP_TOOL_LOOKUP.QUERY_IDL_SESSION,
      MCP_TOOL_LOOKUP.RUN_IDL_FILE,
      MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK,
    ],
  },
};

/** Guidance for discovering tools that are not in the initial model context. */
export const MCP_TOOLSET_INSTRUCTIONS =
  'Only core MCP tools are initially available. Call load-toolset to enable ' +
  'additional capabilities before using them. Prefer loading the appropriate ' +
  'toolset over recreating its capabilities with IDL code. Loading is additive ' +
  'for this conversation and does not execute the loaded tools.';

/** Outcome of exposing a toolset and its dependencies. */
export interface IMCPToolsetLoadResult {
  /** All loaded groups, including the always-available core. */
  loadedToolsets: ('core' | MCPToolsetName)[];
  /** Runtime tool names available from the requested group and dependencies. */
  tools: string[];
  /** Requested tools excluded by the configured MCP tool policy. */
  unavailableTools: string[];
}
