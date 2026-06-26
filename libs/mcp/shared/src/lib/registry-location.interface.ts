/**
 * When a task come from a file
 */
export type RegistryLocation_File = 'file';

/**
 * Metadata when a task comes from a file
 */
export interface RegistryLocationMetadata_File {
  /**
   * Fully-qualified path to the task file on disk
   */
  path: string;
}

/**
 * When a task come from memory
 */
export type RegistryLocation_Memory = 'memory';

/**
 * Metadata when a task comes from memory
 */
export interface RegistryLocationMetadata_Memory {
  /**
   * Content of the task
   */
  content: string;
}

/**
 * When something comes from the repository
 */
export type RegistryLocation_Repository = 'repository';

/**
 * Metadata when something comes from a repository
 */
export interface RegistryLocationMetadata_Repository {
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
 * The type of registry location
 */
export type RegistryLocationKind =
  | RegistryLocation_File
  | RegistryLocation_Memory
  | RegistryLocation_Repository;

/**
 * Metadata for the location of an item from a registry
 */
export type RegistryLocationMetadata<T extends RegistryLocationKind> =
  T extends RegistryLocation_File
    ? RegistryLocationMetadata_File
    : T extends RegistryLocation_Repository
      ? RegistryLocationMetadata_Repository
      : RegistryLocationMetadata_Memory;

/**
 * Metadata for the registry item
 */
export type RegistryLocation<T extends RegistryLocationKind> = {
  [K in T]: {
    /** Type of task location */
    type: K;
    /** Metadata based on the type of task location */
    meta: RegistryLocationMetadata<K>;
  };
}[T];
