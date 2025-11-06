import { IMCPBaseResponse as IMCPTool_BaseResponse } from './mcp-base-response.interface';

/**
 * Message when query what parameters a specific ENVI Task
 */
export type MCPTool_ENVIGetTaskParmaeters = 'envi/get-task-parameters';

/**
 * Message when query what tasks ENVI can run
 */
export type MCPTool_ENVIListTasks = 'envi/list-tasks';

/**
 * Message when opening an image in ENVI
 */
export type MCPTool_ENVIOpenDataset = 'envi/open-dataset';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_ENVIOpenDataset {
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
export type MCPToolResponse_ENVIOpenDataset = IMCPTool_BaseResponse;

/**
 * Message when querying a dataset for more information
 */
export type MCPTool_ENVIQueryDataset = 'envi/query-dataset';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_ENVIQueryDataset {
  /**
   * Dehydrated form of the dataset we want to query
   */
  dataset: { [key: string]: any };
}

/**
 * Response for opening an image in ENVI
 */
export interface MCPToolResponse_ENVIQueryDataset
  extends IMCPTool_BaseResponse {
  /** Information about the dataset that we return to the agent */
  info: { [key: string]: any };
}

/**
 * Message when we run an ENVI Task
 */
export type MCPTool_ENVIRunTask = 'envi/run-task';

/**
 * Payload for running an ENVI Task
 */
export interface MCPToolParams_ENVIRunTask {
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
export interface MCPToolResponse_ENVIRunTask extends IMCPTool_BaseResponse {
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
export type MCPTool_ENVIStart = 'envi/start';

/**
 * Payload for starting ENVI
 */
export interface MCPToolParams_ENVIStart {
  /**
   * Do we display the UI or not?
   */
  headless: boolean;
}

/**
 * Response for starting ENVI
 */
export type MCPToolResponse_ENVIStart = IMCPTool_BaseResponse;

/**
 * Message when we want to create an IDL Notebook
 */
export type MCPTool_IDLCreateNotebook = 'idl/create-notebook';

/**
 * Parameters for creating an IDL Notebook
 */
export interface MCPToolParams_IDLCreateNotebook {
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
export type MCPToolResponse_IDLCreateNotebook = IMCPTool_BaseResponse;

/**
 * Message when we want to run IDL code
 */
export type MCPTool_IDLExecuteCode = 'idl/execute-code';

/**
 * Parameters for running IDL code
 */
export interface MCPToolParams_IDLExecuteCode {
  /**
   * The code to run
   */
  code: string;
}

/**
 * Response for running IDL code
 */
export interface MCPToolResponse_IDLExecuteCode extends IMCPTool_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}

/**
 * Message when we want to run IDL code within a file
 */
export type MCPTool_IDLExecuteFile = 'idl/execute-file';

/**
 * Parameters for running IDL code within a file
 */
export interface MCPToolParams_IDLExecuteFile {
  /**
   * The fully-qualified path to the file to run
   */
  uri: string;
}

/**
 * Response for running IDL code within a file
 */
export interface MCPToolResponse_IDLExecuteFile extends IMCPTool_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}

/**
 * Message when start IDL
 */
export type MCPTool_IDLStart = 'idl/start';

/**
 * Payload for starting IDL
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_IDLStart {}

/**
 * Response for starting IDL
 */
export type MCPToolResponse_IDLStart = IMCPTool_BaseResponse;

/**
 * Types of MCP messages
 */
export type MCPTools =
  | MCPTool_ENVIGetTaskParmaeters
  | MCPTool_ENVIListTasks
  | MCPTool_ENVIOpenDataset
  | MCPTool_ENVIQueryDataset
  | MCPTool_ENVIRunTask
  | MCPTool_ENVIStart
  | MCPTool_IDLCreateNotebook
  | MCPTool_IDLExecuteCode
  | MCPTool_IDLExecuteFile
  | MCPTool_IDLStart;

/**
 * Payloads for all MCP messages
 */
export type MCPToolParams<T extends MCPTools> =
  T extends MCPTool_ENVIOpenDataset
    ? MCPToolParams_ENVIOpenDataset
    : T extends MCPTool_ENVIQueryDataset
    ? MCPToolParams_ENVIQueryDataset
    : T extends MCPTool_ENVIRunTask
    ? MCPToolParams_ENVIRunTask
    : T extends MCPTool_ENVIStart
    ? MCPToolParams_ENVIStart
    : T extends MCPTool_IDLCreateNotebook
    ? MCPToolParams_IDLCreateNotebook
    : T extends MCPTool_IDLExecuteCode
    ? MCPToolParams_IDLExecuteCode
    : T extends MCPTool_IDLExecuteFile
    ? MCPToolParams_IDLExecuteFile
    : T extends MCPTool_IDLStart
    ? MCPToolParams_IDLStart
    : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> =
  T extends MCPTool_ENVIOpenDataset
    ? MCPToolResponse_ENVIOpenDataset
    : T extends MCPTool_ENVIQueryDataset
    ? MCPToolResponse_ENVIQueryDataset
    : T extends MCPTool_ENVIRunTask
    ? MCPToolResponse_ENVIRunTask
    : T extends MCPTool_ENVIStart
    ? MCPToolResponse_ENVIStart
    : T extends MCPTool_IDLCreateNotebook
    ? MCPToolResponse_IDLCreateNotebook
    : T extends MCPTool_IDLExecuteCode
    ? MCPToolResponse_IDLExecuteCode
    : T extends MCPTool_IDLExecuteFile
    ? MCPToolResponse_IDLExecuteFile
    : T extends MCPTool_IDLStart
    ? MCPToolResponse_IDLStart
    : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Query parameters for tasks ENVI has */
  ENVI_GET_TASK_PARAMETERS: MCPTool_ENVIGetTaskParmaeters;
  /** Query ENVI's tasks */
  ENVI_LIST_TASKS: MCPTool_ENVIListTasks;
  /** Open a dataset in ENVI */
  ENVI_OPEN_DATASET: MCPTool_ENVIOpenDataset;
  /** Get additional information about a dataset */
  ENVI_QUERY_DATASET: MCPTool_ENVIQueryDataset;
  /** Run ENVI Task */
  ENVI_RUN_TASK: MCPTool_ENVIRunTask;
  /** Start ENVI */
  ENVI_START: MCPTool_ENVIStart;
  /** Create an IDL Notebook */
  IDL_CREATE_NOTEBOOK: MCPTool_IDLCreateNotebook;
  /** Run code in IDL */
  IDL_EXECUTE_CODE: MCPTool_IDLExecuteCode;
  /** Run code in IDL that comes from a file */
  IDL_EXECUTE_FILE: MCPTool_IDLExecuteFile;
  /** Start IDL */
  IDL_START: MCPTool_IDLStart;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  IDL_CREATE_NOTEBOOK: 'idl/create-notebook',
  IDL_EXECUTE_CODE: 'idl/execute-code',
  IDL_EXECUTE_FILE: 'idl/execute-file',
  ENVI_OPEN_DATASET: 'envi/open-dataset',
  ENVI_QUERY_DATASET: 'envi/query-dataset',
  ENVI_LIST_TASKS: 'envi/list-tasks',
  ENVI_GET_TASK_PARAMETERS: 'envi/get-task-parameters',
  ENVI_RUN_TASK: 'envi/run-task',
  ENVI_START: 'envi/start',
  IDL_START: 'idl/start',
};
