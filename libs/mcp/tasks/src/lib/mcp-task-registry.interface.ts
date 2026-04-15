import {
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { ValidateFunction } from 'ajv';
import { JsonSchema7Type } from 'zod-to-json-schema';

import { TaskLocation, TaskLocationKind } from './task-location.interface';

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
  location?: TaskLocation<TaskLocationKind>;
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
