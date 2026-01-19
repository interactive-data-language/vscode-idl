import { IMCPTool_BaseResponse } from './mcp-base-response.interface';

/**
 * Message when opening an image in ENVI
 */
export type MCPTool_ENVIOpenDatasets = 'open-datasets-in-envi';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_ENVIOpenDatasets {
  /**
   * For a single dataset, do we zoom to the extent of the layer?
   *
   * If more than one, we zoom to the view's full extent.
   *
   * Make sure this matches logic in `vscode_displayDatasets` in IDL
   */
  automaticZoom: 'all-layers' | 'last-layer' | 'none';
  /**
   * The dehydrated datasets to open
   */
  datasets: { [key: string]: any }[];
  /**
   * Do we reset the display or not?
   */
  resetView: boolean;
}

/**
 * Response for opening an image in ENVI
 */
export interface MCPToolResponse_ENVIOpenDatasets
  extends IMCPTool_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
}

/**
 * Message when querying a dataset for more information
 */
export type MCPTool_ENVIQueryDataset = 'query-dataset-with-envi';

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
export type MCPTool_ENVIRunTool = 'run-envi-tool';

/**
 * Payload for running an ENVI Task
 */
export interface MCPToolParams_ENVIRunTool {
  /** Parameters */
  inputParameters: { [key: string]: any };
  /** Show UI for user to control execution? */
  interactive: boolean;
  /**
   * Name of the task
   */
  taskName: string;
}

/**
 * Response for starting ENVI
 */
export interface MCPToolResponse_ENVIRunTool extends IMCPTool_BaseResponse {
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
export type MCPTool_ENVIStart = 'start-envi';

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
export interface MCPToolResponse_ENVIStart extends IMCPTool_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
}

/**
 * Message when we want to create an IDL Notebook
 */
export type MCPTool_IDLCreateNotebook = 'create-idl-notebook';

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
export type MCPTool_IDLExecuteCode = 'execute-idl-code';

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
export type MCPTool_IDLExecuteFile = 'execute-idl-file';

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
 * Message when we return notes for IDL and ENVI Tasks
 */
export type MCPTool_IDLReturnNotes = 'return-notes';

/**
 * Parameters for running IDL code
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_IDLReturnNotes {}

/**
 * Response for running IDL code
 */
export interface MCPToolResponse_IDLReturnNotes extends IMCPTool_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
  /** The notes for tasks */
  notes: {
    envi: { [key: string]: string[] };
    idl: { [key: string]: string[] };
  };
}

/**
 * Message when start IDL
 */
export type MCPTool_IDLStart = 'start-idl';

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
 * MCP Tools that run in VSCode
 */
export type MCPTools_VSCode =
  | MCPTool_ENVIOpenDatasets
  | MCPTool_ENVIQueryDataset
  | MCPTool_ENVIRunTool
  | MCPTool_ENVIStart
  | MCPTool_IDLCreateNotebook
  | MCPTool_IDLExecuteCode
  | MCPTool_IDLExecuteFile
  | MCPTool_IDLReturnNotes
  | MCPTool_IDLStart;

/**
 * MCP parameters and payload sent to VSCode to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_VSCode<T extends MCPTools_VSCode> =
  T extends MCPTool_ENVIOpenDatasets
    ? MCPToolParams_ENVIOpenDatasets
    : T extends MCPTool_ENVIQueryDataset
    ? MCPToolParams_ENVIQueryDataset
    : T extends MCPTool_ENVIRunTool
    ? MCPToolParams_ENVIRunTool
    : T extends MCPTool_ENVIStart
    ? MCPToolParams_ENVIStart
    : T extends MCPTool_IDLCreateNotebook
    ? MCPToolParams_IDLCreateNotebook
    : T extends MCPTool_IDLExecuteCode
    ? MCPToolParams_IDLExecuteCode
    : T extends MCPTool_IDLExecuteFile
    ? MCPToolParams_IDLExecuteFile
    : T extends MCPTool_IDLReturnNotes
    ? MCPToolParams_IDLReturnNotes
    : T extends MCPTool_IDLStart
    ? MCPToolParams_IDLStart
    : never;

/**
 * Responses from MCP tools that run in VSCode for ENVI and IDL
 */
export type MCPToolResponse_VSCode<T extends MCPTools_VSCode> =
  T extends MCPTool_ENVIOpenDatasets
    ? MCPToolResponse_ENVIOpenDatasets
    : T extends MCPTool_ENVIQueryDataset
    ? MCPToolResponse_ENVIQueryDataset
    : T extends MCPTool_ENVIRunTool
    ? MCPToolResponse_ENVIRunTool
    : T extends MCPTool_ENVIStart
    ? MCPToolResponse_ENVIStart
    : T extends MCPTool_IDLCreateNotebook
    ? MCPToolResponse_IDLCreateNotebook
    : T extends MCPTool_IDLExecuteCode
    ? MCPToolResponse_IDLExecuteCode
    : T extends MCPTool_IDLExecuteFile
    ? MCPToolResponse_IDLExecuteFile
    : T extends MCPTool_IDLReturnNotes
    ? MCPToolResponse_IDLReturnNotes
    : T extends MCPTool_IDLStart
    ? MCPToolResponse_IDLStart
    : never;
