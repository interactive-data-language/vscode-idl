/**
 * Default styler set
 */
export type DefaultStyler = 'default';

/**
 * Union type for all style generators
 */
export type AssemblerStyler = DefaultStyler;

interface IAssemblerStylerLookup {
  DEFAULT: DefaultStyler;
}

/**
 * Lookup of assembler stylers
 */
export const ASSEMBLER_STYLER_LOOKUP: IAssemblerStylerLookup = {
  DEFAULT: 'default',
};

/** Upper case */
type LowerCaseStyleFlag = 'lower';
/** Lower case */
type UpperCaseStyleFlag = 'upper';
/** Use single quotes */
type SingleQuoteStyleFlag = 'single';
/** Use double quotes */
type DoubleQuoteStyleFlag = 'double';
/** When our style should match the internal/user definition */
type MatchStyleFlag = 'match';
/** Use "dot" notation for methods */
type DotStyleFlag = 'dot';
/** Use "dot" notation for methods */
type ArrowStyleFlag = 'arrow';
/** Don't apply any styling */
type NoneStyleFlag = 'none';

/**
 * Style flags when we manipulate the case, such as numbers or control
 * statements
 */
export type CaseStyleFlags =
  | LowerCaseStyleFlag
  | UpperCaseStyleFlag
  | NoneStyleFlag;

/**
 * When we have style to match, these are our options
 */
export type MatchStyleFlags = MatchStyleFlag | NoneStyleFlag;

/**
 * Style options for methods
 */
export type MethodStyleFlags = DotStyleFlag | ArrowStyleFlag | NoneStyleFlag;

/**
 * Style flags when manipulating quotes/string definitions
 */
export type QuoteStyleFlags =
  | SingleQuoteStyleFlag
  | DoubleQuoteStyleFlag
  | NoneStyleFlag;

/**
 * Any changes to style flags also needs to be captured/updated in the JSON schema
 * file as well. It can be found here:
 *
 * extension/language/schemas/config/v1.schema.json
 */

/** Two options for Fiddle configuration */
export type StyleFlag = CaseStyleFlags | MatchStyleFlags | QuoteStyleFlags;

/** Strictly typed lookup for fiddler flags */
interface IStyleFlags {
  LOWER: LowerCaseStyleFlag;
  UPPER: UpperCaseStyleFlag;
  SINGLE: SingleQuoteStyleFlag;
  DOUBLE: DoubleQuoteStyleFlag;
  MATCH: MatchStyleFlag;
  DOT: DotStyleFlag;
  ARROW: ArrowStyleFlag;
  NONE: NoneStyleFlag;
}

/**
 * Lookup with option flags for the fiddler
 */
export const STYLE_FLAG_LOOKUP: IStyleFlags = {
  LOWER: 'lower',
  UPPER: 'upper',
  SINGLE: 'single',
  DOUBLE: 'double',
  DOT: 'dot',
  ARROW: 'arrow',
  MATCH: 'match',
  NONE: 'none',
};

/**
 * Configuration for our `DefaultAssembler` type.
 */
export interface ICodeStyle {
  /** Single or double quotes for strings */
  quotes: QuoteStyleFlags;
  /** Do we use dot notation for methods or not */
  methods: MethodStyleFlags;
  /** Do we enforce upper case keywords or not */
  keywords: CaseStyleFlags;
  /** Do we use upper case characters for properties or not */
  properties: MatchStyleFlag | CaseStyleFlags;
  /** Are control statements upper or lower case */
  control: CaseStyleFlags;
  /** Formatting for numbers */
  numbers: CaseStyleFlags;
  /** Indicate how hex numbers (starting with \"0x\", expressed as strings, or hex escape characters in tempalte literals) will be formatted. Modern uses lower case and dated uses upper case. */
  hex: CaseStyleFlags;
  /** Formatting for octal numbers starting with "0o" */
  octal: CaseStyleFlags;
  /** Formatting for binary numbers starting with "0b" */
  binary: CaseStyleFlags;
  /** Formatting for routines from core ENVI or IDL */
  routines: MatchStyleFlags;
  /** Formatting for system variables */
  systemVariables: CaseStyleFlags;
  /** How do we format locally defined variables */
  localVariables: MatchStyleFlags;
}
