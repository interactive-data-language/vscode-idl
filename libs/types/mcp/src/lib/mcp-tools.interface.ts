import { IMCPBaseResponse as IMCPTool_BaseResponse } from './mcp-base-response.interface';

/**
 * Message when we want to create an IDL Notebook
 */
export type MCPTool_CreateIDLNotebook = 'create-idl-notebook';

/**
 * Parameters for creating an IDL Notebook
 */
export interface MCPToolParams_CreateIDLNotebook {
  /**
   * The notebook cells
   */
  cells: { type: 'code' | 'markdown'; content: string }[];
  /** File on disk to create */
  uri: string;
}

/**
 * Response for creating an IDL Notebook
 */
export type MCPToolResponse_CreateIDLNotebook = IMCPTool_BaseResponse;

/**
 * Message when we want to run IDL code
 */
export type MCPTool_ExecuteIDLCode = 'execute-idl-code';

/**
 * Parameters for running IDL code
 */
export interface MCPToolParams_ExecuteIDLCode {
  /**
   * The code to run
   */
  code: string;
}

/**
 * Response for running IDL code
 */
export interface MCPToolResponse_ExecuteIDLCode extends IMCPTool_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}

/**
 * Message when we want to run IDL code within a file
 */
export type MCPTool_ExecuteIDLFile = 'execute-idl-file';

/**
 * Parameters for running IDL code within a file
 */
export interface MCPToolParams_ExecuteIDLFile {
  /**
   * The fully-qualified path to the file to run
   */
  uri: string;
}

/**
 * Response for running IDL code within a file
 */
export interface MCPToolResponse_ExecuteIDLFile extends IMCPTool_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}

/**
 * Message when opening an image in ENVI
 */
export type MCPTool_OpenInENVI = 'open-in-envi';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_OpenInENVI {
  /**
   * Do we display the image or not?
   */
  display: boolean;
  /**
   * The file to open
   */
  uri: string;
}

/**
 * Response for opening an image in ENVI
 */
export type MCPToolResponse_OpenInENVI = IMCPTool_BaseResponse;

/**
 * Message when we run an ENVI Task
 */
export type MCPTool_RunENVITask = 'run-envi-task';

/**
 * Payload for running an ENVI Task
 */
export interface MCPToolParams_RunENVITask {
  /** Parameters */
  inputParameters: { [key: string]: any };
  /**
   * Name of the task
   */
  taskName: string;
}

/**
 * Response for starting ENVI
 */
export interface MCPToolResponse_RunENVITask extends IMCPTool_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
  /** output parameters */
  outputParameters: {
    [key: string]: any;
  };
}

/**
 * Message when start ENVI
 */
export type MCPTool_StartENVI = 'start-envi';

/**
 * Payload for starting ENVI
 */
export interface MCPToolParams_StartENVI {
  /**
   * Do we display the UI or not?
   */
  headless: boolean;
}

/**
 * Response for starting ENVI
 */
export type MCPToolResponse_StartENVI = IMCPTool_BaseResponse;

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
export type MCPToolResponse_StartIDL = IMCPTool_BaseResponse;

/**
 * Types of MCP messages
 */
export type MCPTools =
  | MCPTool_CreateIDLNotebook
  | MCPTool_ExecuteIDLCode
  | MCPTool_ExecuteIDLFile
  | MCPTool_OpenInENVI
  | MCPTool_RunENVITask
  | MCPTool_StartENVI
  | MCPTool_StartIDL;

/**
 * Payloads for all MCP messages
 */
export type MCPToolParams<T extends MCPTools> =
  T extends MCPTool_CreateIDLNotebook
    ? MCPToolParams_CreateIDLNotebook
    : T extends MCPTool_ExecuteIDLCode
    ? MCPToolParams_ExecuteIDLCode
    : T extends MCPTool_ExecuteIDLFile
    ? MCPToolParams_ExecuteIDLFile
    : T extends MCPTool_OpenInENVI
    ? MCPToolParams_OpenInENVI
    : T extends MCPTool_RunENVITask
    ? MCPToolParams_RunENVITask
    : T extends MCPTool_StartENVI
    ? MCPToolParams_StartENVI
    : T extends MCPTool_StartIDL
    ? MCPToolParams_StartIDL
    : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> =
  T extends MCPTool_CreateIDLNotebook
    ? MCPToolResponse_CreateIDLNotebook
    : T extends MCPTool_ExecuteIDLCode
    ? MCPToolResponse_ExecuteIDLCode
    : T extends MCPTool_ExecuteIDLFile
    ? MCPToolResponse_ExecuteIDLFile
    : T extends MCPTool_OpenInENVI
    ? MCPToolResponse_OpenInENVI
    : T extends MCPTool_RunENVITask
    ? MCPToolResponse_RunENVITask
    : T extends MCPTool_StartENVI
    ? MCPToolResponse_StartENVI
    : T extends MCPTool_StartIDL
    ? MCPToolResponse_StartIDL
    : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Create an IDL Notebook */
  CREATE_IDL_NOTEBOOK: MCPTool_CreateIDLNotebook;
  /** Run code in IDL */
  EXECUTE_IDL_CODE: MCPTool_ExecuteIDLCode;
  /** Run code in IDL that comes from a file */
  EXECUTE_IDL_FILE: MCPTool_ExecuteIDLFile;
  /** Open a dataset in ENVI */
  OPEN_IN_ENVI: MCPTool_OpenInENVI;
  /** Run ENVI Task */
  RUN_ENVI_TASK: MCPTool_RunENVITask;
  /** Start ENVI */
  START_ENVI: MCPTool_StartENVI;
  /** Start IDL */
  START_IDL: MCPTool_StartIDL;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  CREATE_IDL_NOTEBOOK: 'create-idl-notebook',
  EXECUTE_IDL_CODE: 'execute-idl-code',
  EXECUTE_IDL_FILE: 'execute-idl-file',
  OPEN_IN_ENVI: 'open-in-envi',
  RUN_ENVI_TASK: 'run-envi-task',
  START_ENVI: 'start-envi',
  START_IDL: 'start-idl',
};
