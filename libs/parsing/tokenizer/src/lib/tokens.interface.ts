import { TokenStartMatches } from './token-matches.interface';

/** Property being accessed */
export type AccessPropertyToken = 0;
/** When an argument is defined */
export type ArgDefinitionToken = 1;
/** A standalone arrow for method invocation, found when incomplete  */
export type ArrowToken = 2;
/** Generic token for assignment. can be expanded into variables, properties, keywords, or compound operators */
export type AssignmentToken = 3;
/** Assigning a value to a property */
export type AssignmentPropertyToken = 4;
/** Assigning a value to a variable */
export type AssignmentVariableToken = 5;
/** Block statement from bend...end */
export type BlockToken = 6;
/** Brackets used for indexing arrays */
export type BracketToken = 7;
/** Calling a function */
export type CallFunctionToken = 8;
/** Calling a function method on an object */
export type CallFunctionMethodToken = 9;
/** Calling a lambda function */
export type CallLambdaFunctionToken = 10;
/** Calling a procedure */
export type CallProcedureToken = 11;
/** Calling a procedure method */
export type CallProcedureMethodToken = 12;
/** Colon as used for indexing or ternary operators */
export type ColonToken = 13;
/** Commas */
export type CommaToken = 14;
/** Comments - single line */
export type CommentToken = 15;
/** Comment blocks - multi line */
export type CommentBlockToken = 16;
/** Control statement not covered elsewhere */
export type ControlToken = 17;
/** Break statement in loops */
export type ControlBreakToken = 18;
/** Common variable block */
export type ControlCommonToken = 19;
/** Compile options */
export type ControlCompileOptToken = 20;
/** Continue statement in loops */
export type ControlContinueToken = 21;
/** Forward function */
export type ControlForwardFunctionOptToken = 22;
/** GoTo statement */
export type ControlGoToToken = 23;
/** GoTo label that we actually go to */
export type ControlJumpToken = 24;
/** Options for compound control statements (i.e. compile_opt, forward_function) */
export type ControlOptionToken = 25;
/** An incomplete method or property access */
export type DotToken = 26;
/** Include statement to insert code */
export type IncludeToken = 27;
/** When we hve a keyword being called in a routine */
export type KeywordToken = 28;
/** Binary keyword with `/kw_name` */
export type KeywordBinaryToken = 29;
/** When a keyword is defined */
export type KeywordDefinitionToken = 30;
/** Line continuation */
export type LineContinuationToken = 31;
/** Line continuation basic */
export type LineContinuationBasicToken = 32;
/** Line separation */
export type LineSeparationToken = 33;
/** Line separation within switch/case */
export type LineSeparationBasicToken = 34;
/** General logic statement type */
export type LogicalToken = 35;
/** Case statement start */
export type LogicalCaseToken = 36;
/** The thing we do for a case or switch then statement */
export type LogicalCaseSwitchThenToken = 37;
/** Else statement start */
export type LogicalElseToken = 38;
/** Logic statement in case/switch */
export type LogicalExpressionToken = 39;
/** Default expression for switch/case (the else) */
export type LogicalExpressionDefaultToken = 40;
/** If statement start */
export type LogicalIfToken = 41;
/** Of portion of switch and case */
export type LogicalOfToken = 42;
/** Switch statement start */
export type LogicalSwitchToken = 43;
/** Else part of ternary statement */
export type LogicalTernaryElseToken = 44;
/** Then part of ternary statement */
export type LogicalTernaryThenToken = 45;
/** Then statement start */
export type LogicalThenToken = 46;
/** Generic loop token */
export type LoopToken = 47;
/** Do part of loop */
export type LoopDoToken = 48;
/** For loop */
export type LoopForToken = 49;
/** Foreach loop */
export type LoopForeachToken = 50;
/** Repeat loop */
export type LoopRepeatToken = 51;
/** Until part of repeat loop */
export type LoopUntilToken = 52;
/** While loop */
export type LoopWhileToken = 53;
/** Main level program */
export type MainLevelToken = 54;
/** End of the main level program */
export type MainLevelEndToken = 55;
/** Static numbers */
export type NumberToken = 56;
/** An operator */
export type OperatorToken = 57;
/** Compound operators that also handle assignment */
export type OperatorCompoundToken = 58;
/** increment and decrement operators since they are special */
export type OperatorIncrementDecrementToken = 59;
/** NOT USED RIGHT NOW Pointer dereferencing, derived with post-processing */
export type OperatorIndexingToken = 60;
/** Logical operators (i.e. "and", "or", "ge", "&&", "||") */
export type OperatorLogicalToken = 61;
/** Change value to be negative */
export type OperatorNegativeToken = 62;
/** Pointer dereferencing, derived with post-processing */
export type OperatorPointerToken = 63;
/** Parentheses for grouping */
export type ParenthesesToken = 64;
/** When we have an IDL or ENVI prompt, used for docs parsing */
export type PromptToken = 65;
/** Python code */
export type PythonToken = 66;
/** Double quotes */
export type QuoteDoubleToken = 67;
/** Single quotes */
export type QuoteSingleToken = 68;
/** Function definition */
export type RoutineFunctionToken = 69;
/** Routine name when we have an object method */
export type RoutineMethodNameToken = 70;
/** Name of routine */
export type RoutineNameToken = 71;
/** Procedure definition */
export type RoutineProcedureToken = 72;
/** Escape characters in string template literals */
export type StringTemplateEscape = 73;
/** String substitution inside of a template literal */
export type StringTemplateExpression = 74;
/** Template literal (template string) using backticks */
export type StringTemplateLiteral = 75;
/** Raw string inside of template literals */
export type StringTemplateString = 76;
/** Structure */
export type StructureToken = 77;
/** Structure property being accessed via indexing syntax */
export type StructureIndexedPropertyToken = 78;
/** Structure inheritance */
export type StructureInheritanceToken = 79;
/** Structure name */
export type StructureNameToken = 80;
/** Structure property */
export type StructurePropertyToken = 81;
/** System variable */
export type SystemVariableToken = 82;
/** Plain text to be inserted */
export type TextToken = 83;
/** TODO statement in comment */
export type ToDoToken = 84;
/** Variable */
export type VariableToken = 85;
/** When we encounter an unexpected closing statement */
export type UnexpectedCloserToken = 86;
/** When we encounter something that was not parsed (i.e. its unknown)  */
export type UnknownToken = 87;
/** When we encounter something that was not parsed (i.e. its unknown)  */
export type ExecutiveCommandToken = 88;

/**
 * Union type of all basic tokens that do not recurse.
 *
 * Used for adding smarts to our tree building and for automating
 * types being branches or basic tokens.
 *
 * Needs to be manually updated when/if tokens change.
 */
export type BasicTokenNames =
  | AccessPropertyToken
  | ArgDefinitionToken
  | ArrowToken
  | ColonToken
  | CommaToken
  | CommentToken
  | ControlBreakToken
  | ControlContinueToken
  | ControlJumpToken
  | ControlOptionToken
  | DotToken
  | IncludeToken
  | KeywordToken
  | KeywordBinaryToken
  | KeywordDefinitionToken
  | LineContinuationBasicToken
  | LineSeparationBasicToken
  | MainLevelEndToken
  | NumberToken
  | PromptToken
  | PythonToken
  | QuoteSingleToken
  | QuoteDoubleToken
  | StringTemplateEscape
  | StringTemplateString
  | StructureInheritanceToken
  | SystemVariableToken
  | UnknownToken
  | VariableToken
  | UnexpectedCloserToken
  | TextToken
  | ExecutiveCommandToken;

/**
 * Union type of all basic tokens that do recurse.
 *
 * Used for adding smarts to our tree building and for automating
 * types being branches or basic tokens.
 *
 * Needs to be manually updated when/if tokens change.
 */
export type NonBasicTokenNames =
  | AssignmentToken
  | BlockToken
  | BracketToken
  | CallFunctionToken
  | CallFunctionMethodToken
  | CallLambdaFunctionToken
  | CallProcedureToken
  | CallProcedureMethodToken
  | CommentBlockToken
  | ControlToken
  | ControlCommonToken
  | ControlCompileOptToken
  | ControlForwardFunctionOptToken
  | ControlGoToToken
  | LineContinuationToken
  | LineSeparationToken
  | LogicalToken
  | LogicalCaseToken
  | LogicalCaseSwitchThenToken
  | LogicalElseToken
  | LogicalExpressionToken
  | LogicalExpressionDefaultToken
  | LogicalIfToken
  | LogicalOfToken
  | LogicalSwitchToken
  | LogicalTernaryElseToken
  | LogicalTernaryThenToken
  | LogicalThenToken
  | LoopToken
  | LoopDoToken
  | LoopForToken
  | LoopForeachToken
  | LoopRepeatToken
  | LoopUntilToken
  | LoopWhileToken
  | MainLevelToken
  | OperatorToken
  | OperatorCompoundToken
  | OperatorIndexingToken
  | OperatorIncrementDecrementToken
  | OperatorLogicalToken
  | OperatorPointerToken
  | OperatorNegativeToken
  | ParenthesesToken
  | RoutineFunctionToken
  | RoutineMethodNameToken
  | RoutineNameToken
  | RoutineProcedureToken
  | StringTemplateExpression
  | StringTemplateLiteral
  | StructureToken
  | StructureIndexedPropertyToken
  | StructureNameToken
  | StructurePropertyToken
  | ToDoToken;

/**
 * Allowed type of token
 */
export type TokenName = BasicTokenNames | NonBasicTokenNames;

/**
 * Strictly typed data structure with easy-lookup of token types
 */
export interface ITokenNameLookup {
  /** When an argument is defined */
  ARG_DEFINITION: ArgDefinitionToken;
  /** Property being accessed */
  ACCESS_PROPERTY: AccessPropertyToken;
  /** A standalone arrow for method invocation, found when incomplete  */
  ARROW: ArrowToken;
  /** Generic token for assignment. can be expanded into variables, properties, or compound operators */
  ASSIGNMENT: AssignmentToken;
  // /** Assigning a value to a property */
  // ASSIGNMENT_PROPERTY: AssignmentPropertyToken;
  // /** Assigning a value to a variable */
  // ASSIGNMENT_VARIABLE: AssignmentVariableToken;
  /** Block statement from bend...end */
  BLOCK: BlockToken;
  /** Brackets used for indexing arrays */
  BRACKET: BracketToken;
  /** Calling a function */
  CALL_FUNCTION: CallFunctionToken;
  /** Calling a function method on an object */
  CALL_FUNCTION_METHOD: CallFunctionMethodToken;
  /** Calling a lambda function */
  CALL_LAMBDA_FUNCTION: CallLambdaFunctionToken;
  /** Calling a procedure */
  CALL_PROCEDURE: CallProcedureToken;
  /** Calling a procedure method */
  CALL_PROCEDURE_METHOD: CallProcedureMethodToken;
  /** Colon as used for indexing or ternary operators */
  COLON: ColonToken;
  /** Commas */
  COMMA: CommaToken;
  /** Comments - single line */
  COMMENT: CommentToken;
  /** Comment blocks - multi line */
  COMMENT_BLOCK: CommentBlockToken;
  /** Control statement not covered elsewhere */
  CONTROL: ControlToken;
  /** Break statement in loops */
  CONTROL_BREAK: ControlBreakToken;
  /** Common variable block */
  CONTROL_COMMON: ControlCommonToken;
  /** Compile options */
  CONTROL_COMPILE_OPT: ControlCompileOptToken;
  /** Continue statement in loops */
  CONTROL_CONTINUE: ControlContinueToken;
  /** GoTo statement */
  CONTROL_GO_TO: ControlGoToToken;
  /** GoTo label that we actually go to */
  CONTROL_JUMP: ControlJumpToken;
  /** Forward function */
  CONTROL_FORWARD_FUNCTION: ControlForwardFunctionOptToken;
  /** Options for compound control statements (i.e. compile_opt, forward_function) */
  CONTROL_OPTION: ControlOptionToken;
  /** An incomplete method or property access */
  DOT: DotToken;
  /** IDL executive command (i.e. ".run") */
  EXECUTIVE_COMMAND: ExecutiveCommandToken;
  /** Include statement to insert code */
  INCLUDE: IncludeToken;
  /** When we hve a keyword being called in a routine */
  KEYWORD: KeywordToken;
  /** Binary keyword with `/kw_name` */
  KEYWORD_BINARY: KeywordBinaryToken;
  /** When a keyword is defined */
  KEYWORD_DEFINITION: KeywordDefinitionToken;
  /** General logic statement type */
  LOGICAL: LogicalToken;
  /** Case statement start */
  LOGICAL_CASE: LogicalCaseToken;
  /** Else statement start */
  LOGICAL_ELSE: LogicalElseToken;
  /** The "if" portion of case and switch statements */
  LOGICAL_EXPRESSION: LogicalExpressionToken;
  /** The thing we do for a case or switch then statement */
  LOGICAL_CASE_SWITCH_THEN: LogicalCaseSwitchThenToken;
  /** The default case for case or switch */
  LOGICAL_EXPRESSION_DEFAULT: LogicalExpressionDefaultToken;
  /** If statement start */
  LOGICAL_IF: LogicalIfToken;
  /** Of portion of switch and case */
  LOGICAL_OF: LogicalOfToken;
  /** Switch statement start */
  LOGICAL_SWITCH: LogicalSwitchToken;
  /** Else part of ternary statement */
  LOGICAL_TERNARY_ELSE: LogicalTernaryElseToken;
  /** Then part of ternary statement */
  LOGICAL_TERNARY_THEN: LogicalTernaryThenToken;
  /** Then statement start */
  LOGICAL_THEN: LogicalThenToken;
  /** Line continuation */
  LINE_CONTINUATION: LineContinuationToken;
  /** Line continuation basic */
  LINE_CONTINUATION_BASIC: LineContinuationBasicToken;
  /** Line separation */
  LINE_SEPARATION: LineSeparationToken;
  /** Line separation within switch/case */
  LINE_SEPARATION_BASIC: LineSeparationBasicToken;
  /** Generic loop token */
  LOOP: LoopToken;
  /** Do part of loop */
  LOOP_DO: LoopDoToken;
  /** For loop */
  LOOP_FOR: LoopForToken;
  /** Foreach loop */
  LOOP_FOREACH: LoopForeachToken;
  /** Repeat loop */
  LOOP_REPEAT: LoopRepeatToken;
  /** Until part of repeat loop */
  LOOP_UNTIL: LoopUntilToken;
  /** While loop */
  LOOP_WHILE: LoopWhileToken;
  /** Main level program */
  MAIN_LEVEL: MainLevelToken;
  /** End of the main level program */
  MAIN_LEVEL_END: MainLevelEndToken;
  /** Static numbers */
  NUMBER: NumberToken;
  /** An operator */
  OPERATOR: OperatorToken;
  /** Compound operators that also handle assignment */
  OPERATOR_COMPOUND: OperatorCompoundToken;
  /** increment and decrement operators since they are special */
  OPERATOR_INCREMENT_DECREMENT: OperatorIncrementDecrementToken;
  /** NOT USED RIGHT NOW Pointer dereferencing, derived with post-processing */
  OPERATOR_INDEXING: OperatorIndexingToken;
  /** Logical operators (i.e. "and", "or", "ge", "&&", "||") */
  OPERATOR_LOGICAL: OperatorLogicalToken;
  /** Change value to be negative */
  OPERATOR_NEGATIVE: OperatorNegativeToken;
  /** Pointer dereferencing, derived with post-processing */
  OPERATOR_POINTER: OperatorPointerToken;
  /** Parentheses for grouping */
  PARENTHESES: ParenthesesToken;
  /** When we have an IDL or ENVI prompt, used for docs parsing */
  PROMPT: PromptToken;
  /** Python code */
  PYTHON: PythonToken;
  /** Double quotes */
  QUOTE_DOUBLE: QuoteDoubleToken;
  /** Single quotes */
  QUOTE_SINGLE: QuoteSingleToken;
  /** Function definition */
  ROUTINE_FUNCTION: RoutineFunctionToken;
  /** Routine name when we have an object method */
  ROUTINE_METHOD_NAME: RoutineMethodNameToken;
  /** Name of routine */
  ROUTINE_NAME: RoutineNameToken;
  /** Procedure definition */
  ROUTINE_PROCEDURE: RoutineProcedureToken;
  /** Escape characters in string template literals */
  STRING_TEMPLATE_ESCAPE: StringTemplateEscape;
  /** String substitution inside of a template literal */
  STRING_TEMPLATE_EXPRESSION: StringTemplateExpression;
  /** Template literal (template string) using backticks */
  STRING_TEMPLATE_LITERAL: StringTemplateLiteral;
  /** Raw string inside of template literals */
  STRING_TEMPLATE_STRING: StringTemplateString;
  /** Structure */
  STRUCTURE: StructureToken;
  /** Structure property being accessed via indexing syntax */
  STRUCTURE_INDEXED_PROPERTY: StructureIndexedPropertyToken;
  /** Structure inheritance */
  STRUCTURE_INHERITANCE: StructureInheritanceToken;
  /** Structure name */
  STRUCTURE_NAME: StructureNameToken;
  /** Structure property */
  STRUCTURE_PROPERTY: StructurePropertyToken;
  /** System variable */
  SYSTEM_VARIABLE: SystemVariableToken;
  /** Plain text to be inserted */
  TEXT: TextToken;
  /** TODO statement in comment */
  TODO: ToDoToken;
  /** Variables and system variables (TODO: separate in future) */
  VARIABLE: VariableToken;
  /** When we encounter an unexpected closing statement */
  UNEXPECTED_CLOSER: UnexpectedCloserToken;
  /** When we encounter something that was not parsed (i.e. its unknown)  */
  UNKNOWN: UnknownToken;
}

/**
 * Lookup for string/types for each kind of token.
 *
 * Centralized so that we can easily change names/values across project.
 */
export const TOKEN_NAMES: ITokenNameLookup = {
  ARG_DEFINITION: 1,
  ACCESS_PROPERTY: 0,
  ARROW: 2,
  ASSIGNMENT: 3,
  // ASSIGNMENT_VARIABLE: 5,
  // ASSIGNMENT_PROPERTY: 4,
  BLOCK: 6,
  BRACKET: 7,
  CALL_FUNCTION: 8,
  CALL_FUNCTION_METHOD: 9,
  CALL_LAMBDA_FUNCTION: 10,
  CALL_PROCEDURE: 11,
  CALL_PROCEDURE_METHOD: 12,
  COLON: 13,
  COMMA: 14,
  COMMENT: 15,
  COMMENT_BLOCK: 16,
  CONTROL: 17,
  CONTROL_BREAK: 18,
  CONTROL_COMMON: 19,
  CONTROL_COMPILE_OPT: 20,
  CONTROL_CONTINUE: 21,
  CONTROL_FORWARD_FUNCTION: 22,
  CONTROL_GO_TO: 23,
  CONTROL_JUMP: 24,
  CONTROL_OPTION: 25,
  DOT: 26,
  EXECUTIVE_COMMAND: 88,
  INCLUDE: 27,
  KEYWORD: 28,
  KEYWORD_BINARY: 29,
  KEYWORD_DEFINITION: 30,
  LINE_CONTINUATION: 31,
  LINE_CONTINUATION_BASIC: 32,
  LINE_SEPARATION: 33,
  LINE_SEPARATION_BASIC: 34,
  LOGICAL: 35,
  LOGICAL_CASE: 36,
  LOGICAL_CASE_SWITCH_THEN: 37,
  LOGICAL_ELSE: 38,
  LOGICAL_EXPRESSION: 39,
  LOGICAL_EXPRESSION_DEFAULT: 40,
  LOGICAL_IF: 41,
  LOGICAL_OF: 42,
  LOGICAL_SWITCH: 43,
  LOGICAL_TERNARY_ELSE: 44,
  LOGICAL_TERNARY_THEN: 45,
  LOGICAL_THEN: 46,
  LOOP: 47,
  LOOP_DO: 48,
  LOOP_FOR: 49,
  LOOP_FOREACH: 50,
  LOOP_REPEAT: 51,
  LOOP_UNTIL: 52,
  LOOP_WHILE: 53,
  MAIN_LEVEL: 54,
  MAIN_LEVEL_END: 55,
  NUMBER: 56,
  OPERATOR: 57,
  OPERATOR_COMPOUND: 58,
  OPERATOR_INCREMENT_DECREMENT: 59,
  OPERATOR_INDEXING: 60,
  OPERATOR_LOGICAL: 61,
  OPERATOR_NEGATIVE: 62,
  OPERATOR_POINTER: 63,
  PARENTHESES: 64,
  PROMPT: 65,
  PYTHON: 66,
  QUOTE_DOUBLE: 67,
  QUOTE_SINGLE: 68,
  ROUTINE_FUNCTION: 69,
  ROUTINE_METHOD_NAME: 70,
  ROUTINE_NAME: 71,
  ROUTINE_PROCEDURE: 72,
  STRING_TEMPLATE_ESCAPE: 73,
  STRING_TEMPLATE_EXPRESSION: 74,
  STRING_TEMPLATE_LITERAL: 75,
  STRING_TEMPLATE_STRING: 76,
  STRUCTURE: 77,
  STRUCTURE_INDEXED_PROPERTY: 78,
  STRUCTURE_INHERITANCE: 79,
  STRUCTURE_NAME: 80,
  STRUCTURE_PROPERTY: 81,
  SYSTEM_VARIABLE: 82,
  TEXT: 83,
  TODO: 84,
  VARIABLE: 85,
  UNEXPECTED_CLOSER: 86,
  UNKNOWN: 87,
};

/**
 * Structure for regular expressions that parse our code
 */
export interface ITokenDef<T extends TokenName> {
  /** Name of the token */
  name: T;
  /** RegExp for the start or whole token */
  match: RegExp;
  /** If we have more text than our match, this indicates the end of our token */
  end?: RegExp;
  /**
   * When we close our token, do we go to the next line after?
   *
   * This handles special cases, like line continuations when, after line continuation
   * and an optional comment, we need to skip to the next line.
   */
  nextLineOnClose?: boolean;
  /**
   * Optional callback used to get the token name from matches. Use case
   * for this customization is when we have a single regex used for
   * different types of tokens.
   *
   * For example: for, foreach, and while are one regex
   * For example: if, then, and else are one regex
   */
  getTokenName?: (matches: TokenStartMatches<T>) => T;
  /**
   * Optional post-processing for token matches. Called AFTER getTokenName
   */
  postProcessMatches?: (name: T, matches: string[]) => TokenStartMatches<T>;
  /**
   * When a non-basic token ends, check if we have a matching parent token that should
   * be closed immediately afterwards.
   *
   * Only applied if the token we are trying to close matches the token type specified here
   */
  closeParentTokenAfterEnd?: TokenName;
  /**
   * Resets tokens to DEFAULT_TOKENS after closing a token
   */
  defaultTokens?: boolean;
  /**
   * Flag that, if set, will prevent this token from being a match
   * if we are *not* at the beginning on a file
   */
  onlyFirst?: boolean;
}
