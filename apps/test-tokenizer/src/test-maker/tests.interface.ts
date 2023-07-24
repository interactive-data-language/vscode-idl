import { FormatterType, IAssemblerInputOptions } from '@idl/assembling/config';
import { IIndexProCodeOptions } from '@idl/parsing/index';
import { Position } from 'vscode-languageserver/node';

/**
 * Data structure to automate test creation
 */
export interface ITokenTest {
  /** Name of the test */
  name: string;
  /** Code for the test */
  code: string | string[];
}

/**
 * High-level data for all automated tests
 */
interface IBaseAutoTest {
  /** Name of the test suite that we are creating */
  suiteName: string;
  /** Base name of the file to write */
  fileName: string;
}

/**
 * Data structure for automated tests
 */
export interface IAutoTest extends IBaseAutoTest {
  /** Tests to generate */
  tests: ITokenTest[];
}

/**
 * Data structure to automate test creation
 */
export interface ISelectedTests extends ITokenTest {
  /** Cursor position */
  position: Position[];
}

/**
 * Data structure for automated tests
 */
export interface IAutoSelectedTest extends IBaseAutoTest {
  /** Tests to generate */
  tests: ISelectedTests[];
}

/**
 * Tests for syntax validators
 */
export interface ISyntaxValidatorTest extends ITokenTest {
  /** optional configuration to specify for parsing */
  config?: Partial<IIndexProCodeOptions>;
}

/**
 * Data structure for automated syntax validator tests
 */
export interface IAutoSyntaxValidatorTest extends IBaseAutoTest {
  /** Tests to generate */
  tests: ISyntaxValidatorTest[];
}

/**
 * Tests for assembler
 */
export interface ILocalGlobalScopeCompileTest extends ITokenTest {
  /** optional configuration to specify for the assembler */
  config?: Partial<IIndexProCodeOptions>;
}

/**
 * Data structure for automated assembler tests
 */
export interface IAutoLocalGlobalScopeCompileTest extends IBaseAutoTest {
  /** Tests to generate */
  tests: ILocalGlobalScopeCompileTest[];
}

/**
 * Data structure to automate test creation
 */
export interface IHoverHelpTest {
  /** Name of the test */
  name: string;
  /** Base name or relative path of the file we are acting on within the workspace */
  file: string;
  /** Cursor position */
  position: Position[];
}

/**
 * Data structure for automated tests
 */
export interface IHoverHelpTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: IHoverHelpTest[];
}

/**
 * Data structure to automate test creation
 */
export interface IAutoCompleteTest extends IHoverHelpTest {
  /** Optional text filter that will reduce what gets returned  */
  startsWith?: string;
}

/**
 * Data structure for automated tests
 */
export interface IAutoCompleteTests extends IHoverHelpTests {
  /** Tests to generate */
  tests: IAutoCompleteTest[];
}

/**
 * Data structure to automate test creation
 */
export interface ITokenDefTest {
  /** Name of the test */
  name: string;
  /**
   * Files we are indexing for token defs.
   *
   * The positions are in the first file and any subsequent files are parsed for whatever extra
   * content you might need to get a token def.
   */
  files: string[];
  /** Cursor position */
  position: Position[];
}

/**
 * Data structure for automated tests
 */
export interface ITokenDefTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: ITokenDefTest[];
}

/**
 * Data structure to automate test creation
 */
export interface ITaskGenerationTest {
  /** Name of the test */
  name: string;
  /** Base name or relative path of the file we are acting on within the workspace */
  file: string;
  /** Type of task generator */
  type: 'envi' | 'idl';
}

/**
 * Data structure for automated tests
 */
export interface ITaskGenerationTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: ITaskGenerationTest[];
}

/**
 * Data structure to automate test creation
 */
export interface ITaskParsingTest {
  /** Name of the test */
  name: string;
  /**
   * Task file to parse and extract global tokens from
   */
  file: string;
}

/**
 * Data structure for automated tests
 */
export interface ITaskParsingTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: ITaskParsingTest[];
}

/**
 * Data structure to automate test creation
 */
export interface IOutlineTest {
  /** Name of the test */
  name: string;
  /** Base name or relative path of the file we are acting on within the workspace */
  file: string;
}

/**
 * Data structure for automated tests
 */
export interface IOutlineTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: IOutlineTest[];
}

/**
 * Tests for assembler
 */
export interface IAssemblerTest extends ITokenTest {
  /** optional configuration to specify for the assembler */
  config?: Partial<IAssemblerInputOptions<FormatterType>>;
  /** optional configuration to specify for parsing */
  parseConfig?: Partial<IIndexProCodeOptions>;
}

/**
 * Data structure for automated assembler tests
 */
export interface IAutoAssemblerTest extends IBaseAutoTest {
  /** Tests to generate */
  tests: IAssemblerTest[];
}

/**
 * Tests for assembler
 */
export interface ITaskAssemblerTest extends ITokenTest {
  code: string[];
  /** optional configuration to specify for the assembler */
  config?: Partial<IAssemblerInputOptions<FormatterType>>;
}

/**
 * Data structure for automated assembler tests
 */
export interface IAutoTaskAssemblerTest extends IBaseAutoTest {
  /** Tests to generate */
  tests: ITaskAssemblerTest[];
}

/**
 * For global tokens, we define the actions we can take to have fine-tuned control
 * over our index and the problems that get reported.
 */
interface IGlobalActionTest {
  /** The action we take against a particular workspace */
  action: 'add' | 'remove';
  /** Base name or relative path of the file we are acting on within the workspace */
  file: string;
}

/**
 * Tests for global problem detection
 */
export interface IGlobalProblemTest {
  /** Name of the test */
  name: string;
  /** Path with respect to the extension folder, used to fully-qualify test locations */
  workspace: string;
  /** For our base workspace, the actions we4 take */
  actions: IGlobalActionTest[];
}

/** Data structure for automated assembler tests */
export interface IGlobalProblemTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: IGlobalProblemTest[];
}

/**
 * For global tokens, we define the actions we can take to have fine-tuned control
 * over our index and the problems that get reported.
 */
interface IConfigActionTest {
  /** The action we take against a particular workspace */
  action: 'add' | 'get';
  /** Base name or relative path of the file we are acting on within the workspace */
  file: string;
}

/**
 * Tests for global problem detection
 */
export interface IConfigTest {
  /** Name of the test */
  name: string;
  /** Path with respect to the extension folder, used to fully-qualify test locations */
  workspace: string;
  /** For our base workspace, the actions we4 take */
  actions: IConfigActionTest[];
}

/** Data structure for automated assembler tests */
export interface IConfigTests extends IBaseAutoTest {
  /** Tests to generate */
  tests: IConfigTest[];
}
