/**
 * Data structure for features from the profiler.
 *
 * Minimized for performance with less data to move and parse from IDL.
 */
export interface IProfilerItem {
  /** Lines run */
  l_r: number;
  /** Lines total */
  l_t: number;
  /** Number of hits */
  n: number;
  /** Routine name */
  r: string;
  /** 1/0 if system routine or not */
  sys: number;
  /** Time total */
  t: number;
  /** Time self */
  t_s: number;
}
