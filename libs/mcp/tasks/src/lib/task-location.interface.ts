/**
 * When a task come from a file
 */
export type TaskLocation_File = 'file';

/**
 * Metadata when a task comes from a file
 */
export interface TaskLocationMetadata_File {
  /**
   * Fully-qualified path to the task file on disk
   */
  path: string;
}

/**
 * When a task comes from the repository
 */
export type TaskLocation_Repository = 'repository';

/**
 * Metadata when the task comes from a repository
 */
export interface TaskLocationMetadata_Repository {
  /**
   * Name of the package
   */
  packageName: string;
  /**
   * The version of the package to download
   */
  packageVersion: string;
  /**
   * The URL for the analytics repository that we download from
   */
  url: string;
}

/**
 * The type of task location
 */
export type TaskLocationKind = TaskLocation_File | TaskLocation_Repository;

/**
 * Metadata for the location of a task
 */
export type TaskLocationMetadata<T extends TaskLocationKind> =
  T extends TaskLocation_File
    ? TaskLocationMetadata_File
    : T extends TaskLocation_Repository
      ? TaskLocationMetadata_Repository
      : never;

/**
 * Metadata for the task location
 */
export type TaskLocation<T extends TaskLocationKind> = {
  /** Type of task location */
  type: T;
  /** Metadata based on the type of task location */
  meta: TaskLocationMetadata<T>;
};
