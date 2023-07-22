import { IIndexProCodeOptions } from '@idl/parsing/index';

export interface IParsingPerformanceRunnerOpts
  extends Partial<IIndexProCodeOptions> {
  /**
   * Method for performance metrics
   */
  method: 'tokenizer' | 'parser' | 'index-single' | 'index-workspace';
  /**
   * How many times we replicate files
   */
  multiplier: number;
}
