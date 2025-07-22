import { EncodeNotebook } from '@idl/notebooks/encoders';
import { MCPToolParams_CreateIDLNotebook } from '@idl/types/mcp';
import {
  IDLRawNotebook,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/types/notebooks';
import { LINE_SEPARATOR } from '@idl/types/tokenizer';

/**
 * Creates a new IDL Notebook and returns it encoded as byte data
 */
export async function CreateNewIDLNotebook(
  payload: MCPToolParams_CreateIDLNotebook
) {
  /**
   * Create raw notebook
   */
  const raw: IDLRawNotebook<IDLRawNotebookVersion_2_0_0> = {
    version: '2.0.0',
    cells: payload.cells.map((cell) => {
      return {
        type: cell.type,
        content: cell.content.split(LINE_SEPARATOR),
      };
    }),
  };

  // return encoded
  return EncodeNotebook(raw);
}
