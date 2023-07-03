import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';

import { ICodeStyle } from './style.interface';
import { DEFAULT_CODE_STYLE } from './style-rule-sets.interface';

/**
 * Problem codes that prevent us from assembling code (i.e. non-recoverable syntax errors)
 */
export const ASSEMBLER_BLOCKING_PROBLEMS: { [key: number]: boolean } = {};
ASSEMBLER_BLOCKING_PROBLEMS[IDL_PROBLEM_CODES.NOT_CLOSED] = true;
ASSEMBLER_BLOCKING_PROBLEMS[IDL_PROBLEM_CODES.DOUBLE_TOKEN] = true;
// ASSEMBLER_BLOCKING_PROBLEMS[IDL_PROBLEM_CODES.MISSING_MAIN_END] = true;

/** The default assembler for IDL code */
export type FiddleFormatter = 'fiddle';

/** The HTML assembler that converts IDL code to HTML */
export type HTMLFormatter = 'html';

// /**
//  * Configuration for converting IDL code to HTML
//  */
// export interface IHTMLFormatterConfig {
//   /** Background color for the  */
//   background: string;
//   /** Colors used when experting to HTML */
//   colors: {
//     /** Color for functions */
//     function: string;
//     /** Color for procedures */
//     procedure: string;
//   };
// }

/** Type of assembler that we have support for */
export type FormatterType = FiddleFormatter | HTMLFormatter;

interface IAssemblerFormatterLookup {
  FIDDLE: FiddleFormatter;
}

/**
 * Lookup of assembler stylers
 */
export const ASSEMBLER_FORMATTER_LOOKUP: IAssemblerFormatterLookup = {
  FIDDLE: 'fiddle',
};

/**
 * Assembler options independent of formatter
 */
export interface ITrueBaseAssemblerOptions {
  /** How many spaces do we use for indents */
  tabWidth: number;
  /** Character used for end-of-line. Follows pattern for prettier at https://prettier.io/docs/en/options.html#end-of-line */
  eol: 'lf' | 'crlf';
  /** Do we auto-fix problems or not? */
  autoFix: boolean;
  /** Do we auto-fix problems or not? */
  autoDoc: boolean;
  /** Flag that indicates we apply our styles and format the code */
  styleAndFormat: boolean;
}

/**
 * Assembler options excluding code style
 */
export interface IBaseAssemblerOptions<T extends FormatterType>
  extends ITrueBaseAssemblerOptions {
  /** The type of formatter being used to process IDL code */
  formatter: T;
  /** Number of extra spaces to apply before formatting code. Default is `0` */
  spaceOffset: number;
}

/**
 * Options for assembling our code
 */
export interface IAssemblerInputOptions<T extends FormatterType>
  extends IBaseAssemblerOptions<T> {
  /** Config for the assembler that we are using */
  style: Partial<ICodeStyle>;
}

/**
 * Options for assembling our code
 */
export interface IAssemblerOptions<T extends FormatterType>
  extends IAssemblerInputOptions<T> {
  /** Config for the assembler that we are using */
  style: ICodeStyle;
}

/**
 * Default options for use in the assembler
 */
export const DEFAULT_ASSEMBLER_OPTIONS: IAssemblerOptions<FiddleFormatter> = {
  formatter: ASSEMBLER_FORMATTER_LOOKUP.FIDDLE,
  tabWidth: 2,
  eol: 'lf',
  style: DEFAULT_CODE_STYLE,
  autoFix: true,
  autoDoc: false,
  styleAndFormat: true,
  spaceOffset: 0,
};
