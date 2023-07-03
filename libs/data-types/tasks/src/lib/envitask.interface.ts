/** ENVI Task schema 3.3 */
export type ENVITaskSchema33 = 'envitask_3.3';
/** ENVI Task schema 3.2 */
export type ENVITaskSchema32 = 'envitask_3.2';
/** ENVI Task schema 3.1 */
export type ENVITaskSchema31 = 'envitask_3.1';
/** ENVI Task schema 3.0 */
export type ENVITaskSchema30 = 'envitask_3.0';

/**
 *  ENVI Task schema versions
 */
export type ENVITaskSchemaVersion =
  | ENVITaskSchema33
  | ENVITaskSchema32
  | ENVITaskSchema31
  | ENVITaskSchema30;

/**
 * Data structure for task parameters for 3.0
 */
export interface ENVIParameterSchema30 {
  /** Name of the parameter */
  name: string;
  /** Display name of the parameter showed in UI */
  display_name: string;
  /** Type of the parameter */
  type: string;
  /** Direction (input or output) */
  direction: string;
  /** parameter description */
  description: string;
  /** If the parameter is required or not */
  required: boolean;

  /** If array, dimension string */
  dimensions?: string;
  /** Name of the keyword that the ENVI Task gets mapped to */
  keyword?: string;
  /** Available options */
  choiceList?: any;
  /** Default value for the task */
  defaultValue?: any;
  /** Minimum value */
  min?: any;
  /** Minimum value */
  max?: any;
  /** If this task parameter is hidden or not */
  hidden?: boolean;
}

/**
 * Data structure for task parameters for 3.1
 */
export interface ENVIParametersSchema31 extends ENVIParameterSchema30 {
  /** For URI parameters, automatic extension we use */
  auto_extension?: string;
  /** For URI parameters, are we temporary */
  is_temporary?: boolean;
  /** For URI parameters, are we a folder */
  is_directory?: boolean;
  /** URI parameter that controls output location */
  uri_param?: string;
}

/**
 * Data structure for task parameters for 3.2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ENVIParametersSchema32 extends ENVIParametersSchema31 {}

/**
 * Data structure for task parameters for 3.3
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ENVIParametersSchema33 extends ENVIParametersSchema32 {}

/**
 * ENVI Task parameter data structure
 *
 * Broken out by version for extensibility in future
 */
export type ENVITaskParameter<T extends ENVITaskSchemaVersion> =
  T extends ENVITaskSchema33
    ? ENVIParametersSchema33
    : T extends ENVITaskSchema32
    ? ENVIParametersSchema32
    : T extends ENVITaskSchema31
    ? ENVIParametersSchema31
    : T extends ENVITaskSchema30
    ? ENVIParameterSchema30
    : ENVIParameterSchema30;

/**
 * Data structure for root task parameters for 3.0
 */
export interface ENVITaskSchema30Properties {
  /** Name of the task when calling via the ENVI API */
  name: string;
  /** Name of the task that gets displayed in the ENVI UI */
  display_name: string;
  /** Description of what the task does */
  description: string;
  /** Type of the task, should be "ENVITaskFromProcedure" */
  base_class: string;
  /** Name of our routine */
  routine: string;
}

/**
 * Data structure for root task parameters for 3.1
 */
export interface ENVITaskSchema31Properties extends ENVITaskSchema30Properties {
  /** Version of the task */
  revision?: string;
}

/**
 * Data structure for root task parameters for 3.2
 */
export interface ENVITaskSchema32Properties extends ENVITaskSchema31Properties {
  /** Tags for the task */
  tags?: string[];
}

/**
 * Data structure for root task parameters for 3.3
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ENVITaskSchema33Properties
  extends ENVITaskSchema32Properties {}

/**
 * Based on the ENVI Task schema, root level properties
 */
export type ENVITaskProperties<T extends ENVITaskSchemaVersion> =
  T extends ENVITaskSchema33
    ? ENVITaskSchema33Properties
    : T extends ENVITaskSchema32
    ? ENVITaskSchema32Properties
    : T extends ENVITaskSchema31
    ? ENVITaskSchema31Properties
    : T extends ENVITaskSchema30
    ? ENVITaskSchema30Properties
    : ENVITaskSchema30Properties;

/**
 * Data structure for ENVI Tasks
 */
export type ENVITask<T extends ENVITaskSchemaVersion> =
  /** The "&" is for intersection which makes it also have the properties of our other type above */
  ENVITaskProperties<T> & {
    /** Version of the task, designates our other properties */
    schema: T;
    /** Task parameters */
    parameters: ENVITaskParameter<T>[];
  };
