import { ENVIMCPToolResponse } from './idl/envi-mcp-tool-response.interface';

export type IMCPToolIDL_BaseResponse<TResult = string> =
  ENVIMCPToolResponse<TResult>;
