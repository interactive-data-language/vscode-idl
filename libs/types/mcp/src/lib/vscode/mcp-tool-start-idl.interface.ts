import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when start IDL
 */
export type MCPTool_StartIDL = 'start-idl';

/**
 * Payload for starting IDL
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_StartIDL {}

/**
 * Response for starting IDL
 */
export type MCPToolResponse_StartIDL = IMCPToolVSCode_BaseResponse;
