import {
  ITokenDef,
  StructureIndexedPropertyToken,
  StructureInheritanceToken,
  StructureNameToken,
  StructurePropertyToken,
  StructureToken,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_ASSIGNMENT_END } from '../regex.interface';

export type StructureTokenDef = ITokenDef<StructureToken>;

/**
 * For matching structures
 *
 * @deprecated Now part of GROUPERS
 */
export const STRUCTURE: StructureTokenDef = {
  name: TOKEN_NAMES.STRUCTURE,
  match: /{/im,
  end: /}/im,
};

export type StructureNameTokenDef = ITokenDef<StructureNameToken>;

/**
 * Name of structure
 */
export const STRUCTURE_NAME: StructureNameTokenDef = {
  name: TOKEN_NAMES.STRUCTURE_NAME,
  match: /(?<=^|{)\s*[a-z0-9_$!]+\s*(?=,|}|\$)/im,
  end: /(?=})/im,
};

export type StructureInheritanceTokenDef = ITokenDef<StructureInheritanceToken>;

/**
 * Matches for structure inheritance statements
 *
 * @param {string} fullMatch Full match for inheritance, including "inherits"
 * @param {string} structureName Structure that we inherit
 */
export type StructureInheritanceMatches = [
  fullMatch: string,
  structureName: string
];

/**
 * Name of structure
 */
export const STRUCTURE_INHERITANCE: StructureInheritanceTokenDef = {
  name: TOKEN_NAMES.STRUCTURE_INHERITANCE,
  match: /\binherits\s+([a-z_0-9$]+)?/im,
};

export type StructurePropertyTokenDef = ITokenDef<StructurePropertyToken>;

/**
 * Property definition/creation/setting for structures
 */
export const STRUCTURE_PROPERTY: StructurePropertyTokenDef = {
  name: TOKEN_NAMES.STRUCTURE_PROPERTY,
  match: /[a-z0-9_$]+\s*:/im,
  end: IDL_ASSIGNMENT_END,
};

/**
 * Matches for structure properties
 *
 * @param {string} fullMatch Full match for property, including colon
 * @param {string} propertyName Property name
 */
export type StructurePropertyMatches = [fullMatch: string];

export type StructureIndexedPropertyTokenDef =
  ITokenDef<StructureIndexedPropertyToken>;

/**
 * Using indexing syntax to get structure properties
 */
export const STRUCTURE_INDEXED_PROPERTY: StructureIndexedPropertyTokenDef = {
  name: TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY,
  match: /\.\(/im,
  end: /\)/im,
};
