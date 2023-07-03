import { SyntaxTree } from '../../branches.interface';

/**
 * The result when we split a syntax tree on arguments
 * and keywords.
 */
export interface ISplitTreeOnArguments {
  /**
   * Elements for our arguments
   */
  args: SyntaxTree[];
  /**
   * Elements for our keywords
   */
  keywords: SyntaxTree[];
}
