/**
 * Type when searching for routine docs
 */
export type GetRoutineDocsRoutineType =
  | 'Function'
  | 'FunctionMethod'
  | 'Procedure'
  | 'ProcedureMethod'
  | 'StructureOrClassDefinition'
  | 'SystemVariable';

/**
 * Search global tokens for routine
 */
export type MCPTool_GetRoutineDocs = 'get-routine-docs';

/**
 * Parameters for routines to return docs for
 */
export interface MCPToolParams_GetRoutineDocs {
  /** Routines to return */
  routines: { name: string; type: GetRoutineDocsRoutineType }[];
}
