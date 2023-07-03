import {
  ENVIParameterSchema30,
  ENVITaskSchema30Properties,
  ENVITaskSchema31Properties,
  ENVITaskSchema32Properties,
} from './envitask.interface';

/** IDL Task schema 3.2 */
export type IDLTaskSchema12 = 'idltask_1.2';
/** IDL Task schema 3.1 */
export type IDLTaskSchema11 = 'idltask_1.1';
/** IDL Task schema 3.0 */
export type IDLTaskSchema10 = 'idltask_1.0';

/**
 *  IDL Task schema versions
 */
export type IDLTaskSchemaVersion =
  | IDLTaskSchema12
  | IDLTaskSchema11
  | IDLTaskSchema10;

/**
 * Data structure for task parameters for 1.0
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDLParameterSchema10 extends ENVIParameterSchema30 {}

/**
 * Data structure for task parameters for 1.1
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDLParameterSchema11 extends IDLParameterSchema10 {}

/**
 * Data structure for task parameters for 1.2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDLParameterSchema12 extends IDLParameterSchema11 {}

/**
 * IDL Task parameter data structure, but IDL task version
 *
 * Broken out by version for extensibility in future
 */
export type IDLTaskParameter<T extends IDLTaskSchemaVersion> =
  T extends IDLTaskSchema12
    ? IDLParameterSchema12
    : T extends IDLTaskSchema11
    ? IDLParameterSchema11
    : T extends IDLTaskSchema10
    ? IDLParameterSchema10
    : IDLParameterSchema10;

/**
 * Data structure for root task parameters for 1.0
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDLTaskSchema10Properties extends ENVITaskSchema30Properties {}

/**
 * Data structure for root task parameters for 1.1
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDLTaskSchema11Properties extends ENVITaskSchema31Properties {}

/**
 * Data structure for root task parameters for 1.2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDLTaskSchema12Properties extends ENVITaskSchema32Properties {}

/**
 * Based on the IDL Task schema, root level properties
 */
export type IDLTaskProperties<T extends IDLTaskSchemaVersion> =
  T extends IDLTaskSchema12
    ? IDLTaskSchema12Properties
    : T extends IDLTaskSchema11
    ? IDLTaskSchema11Properties
    : T extends IDLTaskSchema10
    ? IDLTaskSchema10Properties
    : IDLTaskSchema10Properties;

/**
 * Data structure for IDL tasks
 */
export type IDLTask<T extends IDLTaskSchemaVersion> =
  /** The "&" is for intersection which makes it also have the properties of our other type above */
  IDLTaskProperties<T> & {
    /** Version of the task, designates our other properties */
    schema: T;
    /** Task parameters */
    parameters: IDLTaskParameter<T>[];
  };
