import { BlockToken, ITokenDef, TOKEN_NAMES } from '../../tokens.interface';
import { IDL_BLOCK_END } from '../regex.interface';

export type BlockTokenDef = ITokenDef<BlockToken>;

/**
 * Regex for blocks using a begin statement
 */
export const BLOCK: BlockTokenDef = {
  name: TOKEN_NAMES.BLOCK,
  match: /\bbegin\b/im,
  end: IDL_BLOCK_END,
};

/**
 * Regex to validate a block closing statement as valid
 */
export const BLOCK_CLOSE_VALIDATOR =
  /\b(endif|endelse|endfor|endforeach|endrep|endwhile|endswitch|endcase|end)\b/i;
