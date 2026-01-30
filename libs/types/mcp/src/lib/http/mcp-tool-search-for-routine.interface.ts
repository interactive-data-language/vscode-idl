import { GetRoutineDocsRoutineType } from './mcp-tool-get-routine-docs.interface';

/**
 * Find matching routine names
 */
export type MCPTool_SearchForRoutine = 'search-for-routine';

/**
 * Parameters for routines to search for
 */
export interface MCPToolParams_SearchForRoutine {
  /** Routines to search for */
  routines: { name: string; type: 'All' | GetRoutineDocsRoutineType }[];
}
