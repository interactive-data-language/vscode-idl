import { totalmem } from 'os';
import { memoryUsage } from 'process';

import { RoundToNearest } from './round-to-nearest';

/**
 * Gets the total system memory in GB
 */
export function SystemMemoryGB() {
  return Math.round(totalmem() / (1024 * 1024 * 1024));
}

/**
 * Gets the amount of memory V8 is using (rss from memoryUsage()) and is
 * rounded to the nearest 0.5 GB
 */
export function SystemMemoryUsedGB() {
  return RoundToNearest(memoryUsage.rss() / (1024 * 1024 * 1024), 0.25);
}

/**
 * Gets the amount of memory V8 is using (rss from memoryUsage()) and is
 * rounded to the nearest 0.5 GB
 */
export function SystemMemoryUsedMB() {
  return RoundToNearest(memoryUsage.rss() / (1024 * 1024), 10);
}
