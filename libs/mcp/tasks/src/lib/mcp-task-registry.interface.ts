import { JsonSchema7Type } from 'zod-to-json-schema';

import { TaskLocation, TaskLocationKind } from './task-location.interface';

export interface ITaskInformation {
  /** description of the task */
  description: string;
  /** Input parameters for task */
  inputParameters: JsonSchema7Type;
  /** Location of the task if we know it */
  location?: TaskLocation<TaskLocationKind>;
  /** If we have them, additional notes for the task */
  notes?: string[];
  /** Output parameters for task */
  outputParameters: JsonSchema7Type;
}
