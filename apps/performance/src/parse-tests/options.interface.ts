import { IIndexProCodeOptions } from '@idl/parsing/index';

export interface IParsingPerformanceRunnerOpts
  extends Partial<IIndexProCodeOptions> {
  /**
   * If we have compression enabled or not for the IDLIndex
   */
  compression: boolean;
  /**
   * Method for performance metrics
   */
  method:
    | 'file-search'
    | 'index-single'
    | 'index-workspace'
    | 'parser'
    | 'tokenizer';
  /**
   * How many times we replicate files
   */
  multiplier: number;
}
