import { TaskLocation, TaskLocationKind } from './task-location.interface';

export interface ITaskInformation {
  /** description of the task */
  description: string;
  /** Input parameters for task */
  inputParameters: any;
  /** Location of the task if we know it */
  location?: TaskLocation<TaskLocationKind>;
  /** Output parameters for task */
  outputParameters: any;
}
