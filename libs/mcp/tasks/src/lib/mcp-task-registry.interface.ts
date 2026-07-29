import { RegistryLocation, RegistryLocationKind } from '@idl/mcp/shared';
import {
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { ValidateFunction } from 'ajv';
import { JsonSchema7Type } from 'zod-to-json-schema';

/**
 * Internal registry entry that stores all information about a single task
 */
export interface ITaskRegistryEntry {
  /** Description of the task */
  description: string;
  /** Display name of the task */
  displayName: string;
  /** Input parameters for task */
  inputParameters: JsonSchema7Type;
  /** Validation function for input parameters */
  inputValidator: ValidateFunction<any>;
  /** Location of the task if we know it */
  location?: RegistryLocation<RegistryLocationKind>;
  /** Output parameters for task */
  outputParameters: JsonSchema7Type;
  /** The task structure */
  structure: IGlobalIndexedToken<GlobalStructureToken>;
}

/**
 * Include notes for task
 */
export interface ITaskInformation extends ITaskRegistryEntry {
  notes?: string[];
}

/**
 * Optional filters applied when retrieving task descriptions.
 *
 * Whitelist and blacklist entries are matched case-insensitively.
 *
 * - `whitelist`: if provided and non-empty, only tasks whose names appear
 *   in this list will be included in results
 * - `blacklist`: tasks whose names appear in this list are always excluded
 */
export interface ITaskRegistryFilters {
  /** Always exclude tasks whose names are in this list (case-insensitive) */
  blacklist?: string[];
  /** Only return tasks whose names are in this list (case-insensitive) */
  whitelist?: string[];
}
