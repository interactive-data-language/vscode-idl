import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Take ENVI Screenshot
 */
export type MCPTool_TakeENVIScreenshot = 'take-envi-screenshot';

/**
 * Parameters for Take ENVI Screenshot
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_TakeENVIScreenshot {}

/**
 * Response for Take ENVI Screenshot
 *
 * On success, result is a base64-encoded PNG
 * content of the screenshot for direct use by an LLM
 */
export type MCPToolResponse_TakeENVIScreenshot =
  IMCPToolVSCode_BaseResponse<string>;
