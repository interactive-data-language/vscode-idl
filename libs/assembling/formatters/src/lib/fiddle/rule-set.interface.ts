import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { FormatterRuleSet } from '../formatter-rule-set.interface';
import { COMMENT_FORMATTER } from './formatters/comment-formatter';
import { EXECUTIVE_COMMAND_FORMATTER } from './formatters/executive-command-formatter';
import { KEYWORD_FORMATTER } from './formatters/keyword-formatter';
import { LOGICAL_EXPRESSION_DEFAULT_FORMATTER } from './formatters/logical-expression-default-formatter';
import { METHOD_FORMATTER } from './formatters/method-formatter';
import { PROPERTY_FORMATTER } from './formatters/property-formatter';
import { PYTHON_FORMATTER } from './formatters/python-formatter';
import { STRING_TEMPLATE_STRING_FORMATTER } from './formatters/string-literal-formatter';

/**
 * Formatters for the default assembler
 */
export const FIDDLE_FORMATTERS: FormatterRuleSet = {};

// handle methods
FIDDLE_FORMATTERS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = METHOD_FORMATTER;
FIDDLE_FORMATTERS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = METHOD_FORMATTER;

// add special cases for comments
FIDDLE_FORMATTERS[TOKEN_NAMES.COMMENT] = COMMENT_FORMATTER;

// handle keywords
FIDDLE_FORMATTERS[TOKEN_NAMES.KEYWORD] = KEYWORD_FORMATTER;
FIDDLE_FORMATTERS[TOKEN_NAMES.KEYWORD_BINARY] = KEYWORD_FORMATTER;
FIDDLE_FORMATTERS[TOKEN_NAMES.KEYWORD_DEFINITION] = KEYWORD_FORMATTER;

// handle logical statements
FIDDLE_FORMATTERS[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] =
  LOGICAL_EXPRESSION_DEFAULT_FORMATTER;

// handle properties
FIDDLE_FORMATTERS[TOKEN_NAMES.ACCESS_PROPERTY] = PROPERTY_FORMATTER;
FIDDLE_FORMATTERS[TOKEN_NAMES.STRUCTURE_PROPERTY] = PROPERTY_FORMATTER;

// executive commands
FIDDLE_FORMATTERS[TOKEN_NAMES.EXECUTIVE_COMMAND] = EXECUTIVE_COMMAND_FORMATTER;

// handle string literals
FIDDLE_FORMATTERS[TOKEN_NAMES.STRING_TEMPLATE_STRING] =
  STRING_TEMPLATE_STRING_FORMATTER;

// handle string literals
FIDDLE_FORMATTERS[TOKEN_NAMES.PYTHON] = PYTHON_FORMATTER;
