/**
 * Data structure for features from the profiler.
 *
 * Minimized for performance with less data to move and parse from IDL.
 */
export interface IProfilerItem {
  /** Routine name */
  r: string;
  /** Number of hits */
  n: number;
  /** Time total */
  t: number;
  /** Time self */
  t_s: number;
  /** 1/0 if system routine or not */
  sys: number;
  /** Lines run */
  l_r: number;
  /** Lines total */
  l_t: number;
}
