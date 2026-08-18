import { existsSync, FSWatcher, watch } from 'fs';
import { join } from 'path';

import { IRegistryFileWatcherOptions } from './registry-file-watcher.interface';
import {
  RegistryLocation,
  RegistryLocation_File,
} from './registry-location.interface';

/**
 * Watches a folder on disk and invokes callbacks when files are created
 * or deleted.
 *
 * Change events are intentionally ignored because consumers always read
 * the latest content from disk when they need it.
 */
export class RegistryFileWatcher {
  /** Underlying Node.js file system watcher, if currently running */
  private _watcher: FSWatcher | undefined;

  constructor(private readonly options: IRegistryFileWatcherOptions) {
    this._start();
  }

  /**
   * Stops watching the folder and releases the underlying watcher
   */
  stop() {
    this._watcher?.close();
    this._watcher = undefined;
  }

  /**
   * Starts watching the configured folder for file creation/deletion
   */
  private _start() {
    this._watcher = watch(
      this.options.folder,
      { persistent: false },
      (eventType, filename) => {
        // only "rename" events indicate a file was created or deleted, not
        // "change" events which we don't need to know about
        if (eventType !== 'rename' || !filename) {
          return;
        }

        if (
          this.options.filter !== undefined &&
          !this.options.filter.test(filename.toString())
        ) {
          return;
        }

        const location: RegistryLocation<RegistryLocation_File> = {
          type: 'file',
          meta: { path: join(this.options.folder, filename.toString()) },
        };

        // if the file still exists on disk it was created, otherwise deleted
        if (existsSync(location.meta.path)) {
          this.options.onCreate?.(location);
        } else {
          this.options.onDelete?.(location);
        }
      },
    );
  }
}
