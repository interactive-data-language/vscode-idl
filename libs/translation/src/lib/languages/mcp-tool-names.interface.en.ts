import { MCPTools } from '@idl/types/mcp';

import { ValsOfToStrings } from '../translation.interface';

/**
 * Constant with MCP tool names
 *
 * Separate so easier for LLM to edit
 */
export const MCPToolNames_EN: ValsOfToStrings<MCPTools> = {
  'create-idl-notebook': 'Create IDL Notebook',
  'execute-idl-code': 'Execute IDL Code',
  'execute-idl-file': 'Execute IDL File',
  'get-envi-tool-parameters': 'Get ENVI Tool Parameters',
  'get-envi-tool-workflow': 'Get ENVI Tool Workflow',
  'get-resource': 'Get Resource',
  'get-routine-docs': 'Get Routine Docs',
  'list-all-resources': 'List All Resources',
  'list-envi-tool-workflows': 'List ENVI Tool Workflows',
  'list-envi-tools': 'List ENVI Tools',
  'manage-envi-and-idl-session': 'Manage ENVI and IDL Session',
  'open-datasets-in-envi': 'Open Datasets in ENVI',
  'query-dataset-with-envi': 'Query Dataset with ENVI',
  'return-notes': 'Return Notes',
  'run-envi-tool': 'Run ENVI Tool',
  'search-for-files': 'Search for Files',
  'search-for-routine': 'Search for Routine',
  'search-resources': 'Search Resources',
  'start-envi': 'Start ENVI',
  'start-idl': 'Start IDL',
};
