import { PrepareNotebookCellResponse } from './prepare-notebook-cell.message.interface';

/** Prepare IDL code for execution */
export type PrepareIDLCodelMessage = 'prepare-idl-code';

/*
 * Payload to prepare code for execution
 */
export interface PrepareIDLCodePayload {
  /** Cell content */
  code: string;
}

/*
 * Response when preparing code for execution
 */
export type PrepareIDLCodeResponse = PrepareNotebookCellResponse;
