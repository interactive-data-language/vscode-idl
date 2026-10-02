import { MCPTool_OpenDatasetsInENVI } from './idl/mcp-tool-open-datasets-in-envi.interface';
import { MCPTool_QueryDatasetWithENVI } from './idl/mcp-tool-query-dataset-with-envi.interface';
import { MCPToolParamsOverride_OpenDatasetsInENVI } from './override/mcp-tool-open-datasets-in-envi.interface';
import { MCPToolParamsOverride_QueryDatasetWithENVI } from './override/mcp-tool-query-dataset-with-envi.interface';

export type MCPTools_ParameterOverride =
  | MCPTool_OpenDatasetsInENVI
  | MCPTool_QueryDatasetWithENVI;

/**
 * Custom MCP parameters when we have a delta between what arrives via HTTP
 * vs what we need in IDL
 *
 * Handles edge cases where we get more explicit with the types in the MCP
 * tools based on how well LLMs can craft responses with our complex
 * data types for ENVI/
 */
export type MCPToolParams_ParameterOverride<
  T extends MCPTools_ParameterOverride,
> = T extends MCPTool_OpenDatasetsInENVI
  ? MCPToolParamsOverride_OpenDatasetsInENVI
  : T extends MCPTool_QueryDatasetWithENVI
    ? MCPToolParamsOverride_QueryDatasetWithENVI
    : never;
