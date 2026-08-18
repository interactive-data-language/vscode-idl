import {
  RegistryLocation,
  RegistryLocation_File,
} from './registry-location.interface';

/**
 * Callback invoked when a file is created within the watched folder
 */
export type RegistryFileWatcherOnCreate = (
  location: RegistryLocation<RegistryLocation_File>,
) => void;

/**
 * Callback invoked when a file is deleted from the watched folder
 */
export type RegistryFileWatcherOnDelete = (
  location: RegistryLocation<RegistryLocation_File>,
) => void;

/**
 * Options for creating a `RegistryFileWatcher`
 */
export interface IRegistryFileWatcherOptions {
  /**
   * Only files whose name matches this pattern trigger callbacks, e.g. /\.md$/i
   */
  filter?: RegExp;
  /**
   * Fully-qualified path to the folder to watch for file creation/deletion
   */
  folder: string;
  /**
   * Called any time a new file appears in the watched folder
   */
  onCreate?: RegistryFileWatcherOnCreate;
  /**
   * Called any time a file is removed from the watched folder
   */
  onDelete?: RegistryFileWatcherOnDelete;
}
