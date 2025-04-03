/** ENVI Task 5.3.2 */
export type ENVITaskLegacyVersion532 = '5.3.2';
/** ENVI Task 5.3.1 */
export type ENVITaskLegacyVersion531 = '5.3.1';
/** ENVI Task 5.3 */
export type ENVITaskLegacyVersion53 = '5.3';
/** ENVI Task 5.2.1 */
export type ENVITaskLegacyVersion521 = '5.2.1';

/**
 * Legacy ENVI Task versions
 */
export type ENVITaskLegacyVersion =
  | ENVITaskLegacyVersion521
  | ENVITaskLegacyVersion53
  | ENVITaskLegacyVersion531
  | ENVITaskLegacyVersion532;

/**
 * Data structure for task parameters for the 5.2.1 schema
 */
export interface ENVITaskParameter521 {
  /** Available options */
  choiceList?: string[];
  /** Type of the parameter. For arrays, they end with "[*]"" or "[2]" for explicit dimensions */
  dataType: string;
  /** Default value for the task */
  defaultValue?: any;
  /** parameter description */
  description: string;
  /** Direction (input or output) */
  direction: string;
  /** Display name of the parameter showed in UI */
  displayName: string;

  /** If this task parameter is hidden or not */
  hidden?: boolean;
  /** Name of the keyword that the ENVI Task gets mapped to */
  keyword?: string;
  /** Minimum value */
  max?: any;
  /** Minimum value */
  min?: any;
  /** Name of the parameter */
  name: string;
  /** If the parameter is required or not */
  parameterType: 'optional' | 'required';
}

/**
 * ENVI Task parameter data structure
 *
 * They are all the same, but it gives us a place that they can all live in case
 * we need to make changes in the future and will follow the pattern of our other tasks
 */
export type ENVITaskLegacyParameter<T extends ENVITaskLegacyVersion> =
  T extends ENVITaskLegacyVersion532
    ? ENVITaskParameter521
    : T extends ENVITaskLegacyVersion531
    ? ENVITaskParameter521
    : T extends ENVITaskLegacyVersion53
    ? ENVITaskParameter521
    : T extends ENVITaskLegacyVersion521
    ? ENVITaskParameter521
    : ENVITaskParameter521;

/**
 * Data structure for legacy ENVI Task schemas
 */
export type ENVITaskLegacy<T extends ENVITaskLegacyVersion> = {
  /** Version of the task, designates our other properties */
  version: T;
  /** Name of the task when calling via the ENVI API */
  name: string;
  /** Name of the task that gets displayed in the ENVI UI */
  displayName: string;
  /** Description of what the task does */
  description: string;
  /** Type of the task, should be "ENVITaskFromProcedure" */
  baseClass: string;
  /** Name of our routine */
  routine: string;
  /** Task parameters */
  parameters: ENVITaskLegacyParameter<T>[];
};
