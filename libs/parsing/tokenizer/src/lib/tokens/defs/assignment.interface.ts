import {
  AssignmentToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_ASSIGNMENT_END } from '../regex.interface';

export type AssignmentTokenDef = ITokenDef<AssignmentToken>;

/**
 * Regex to find all types of assignment (variables, properties, keywords, compound)
 */
export const ASSIGNMENT: AssignmentTokenDef = {
  name: TOKEN_NAMES.ASSIGNMENT,
  match: /(\*|\+|-|\^|##|#|\/|<|>|and|or|xor|eq|ne|lt|le|gt|ge|mod)?=/im,
  end: IDL_ASSIGNMENT_END,
};
