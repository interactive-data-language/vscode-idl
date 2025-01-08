import { SystemMemoryGB } from './system-memory-gb';

/**
 * Configuration for memory usage within our node apps
 */
export const NODE_MEMORY_CONFIG = {
  /**
   * Old memory (i.e. how much total memory can we user)
   */
  OLD: Math.floor(SystemMemoryGB() * 0.75 * 1024),
  /**
   * Old memory size for worker threads
   */
  OLD_WORKER: Math.floor(8 * 1024),
  /**
   * Young memory (i.e. anything that exceeds this gets put into old and gets ran through GC)
   */
  YOUNG: 64,
};
