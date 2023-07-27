import { IIndexProCodeOptions } from '@idl/parsing/index';

export interface IParsingPerformanceRunnerOpts
  extends Partial<IIndexProCodeOptions> {
  /**
   * Method for performance metrics
   */
  method:
    | 'tokenizer'
    | 'parser'
    | 'index-single'
    | 'index-workspace'
    | 'file-search';
  /**
   * How many times we replicate files
   */
  multiplier: number;
  /**
   * If we have compression enabled or not for the IDLIndex
   */
  compression: boolean;
}
