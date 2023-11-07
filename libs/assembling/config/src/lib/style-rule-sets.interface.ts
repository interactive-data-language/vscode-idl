import copy from 'fast-copy';

import { ICodeStyle, STYLE_FLAG_LOOKUP } from './style.interface';

/**
 * Rule set for our modern style
 *
 * NOTE: We don't have rule-sets yet, just a place holder and this
 * is our default styling
 */
export const MODERN_STYLE_RULE_SET: ICodeStyle = {
  quotes: STYLE_FLAG_LOOKUP.SINGLE,
  methods: STYLE_FLAG_LOOKUP.DOT,
  keywords: STYLE_FLAG_LOOKUP.LOWER,
  properties: STYLE_FLAG_LOOKUP.CAMEL,
  control: STYLE_FLAG_LOOKUP.LOWER,
  numbers: STYLE_FLAG_LOOKUP.LOWER,
  hex: STYLE_FLAG_LOOKUP.LOWER,
  octal: STYLE_FLAG_LOOKUP.LOWER,
  binary: STYLE_FLAG_LOOKUP.LOWER,
  routines: STYLE_FLAG_LOOKUP.MATCH,
  routineMethods: STYLE_FLAG_LOOKUP.CAMEL,
  systemVariables: STYLE_FLAG_LOOKUP.LOWER,
  localVariables: STYLE_FLAG_LOOKUP.MATCH,
  structureNames: STYLE_FLAG_LOOKUP.PASCAL,
};

/**
 * Dated rule set for style
 *
 * NOTE: We don't have rule-sets yet, just a place holder
 */
export const DATED_RULE_SET: ICodeStyle = {
  quotes: STYLE_FLAG_LOOKUP.DOUBLE,
  methods: STYLE_FLAG_LOOKUP.ARROW,
  keywords: STYLE_FLAG_LOOKUP.UPPER,
  properties: STYLE_FLAG_LOOKUP.UPPER,
  control: STYLE_FLAG_LOOKUP.UPPER,
  numbers: STYLE_FLAG_LOOKUP.UPPER,
  hex: STYLE_FLAG_LOOKUP.UPPER,
  octal: STYLE_FLAG_LOOKUP.UPPER,
  binary: STYLE_FLAG_LOOKUP.UPPER,
  routines: STYLE_FLAG_LOOKUP.MATCH,
  routineMethods: STYLE_FLAG_LOOKUP.PASCAL,
  systemVariables: STYLE_FLAG_LOOKUP.UPPER,
  localVariables: STYLE_FLAG_LOOKUP.MATCH,
  structureNames: STYLE_FLAG_LOOKUP.UPPER,
};

/**
 * Default styles to be applied with the formatter
 */
export const DEFAULT_CODE_STYLE: ICodeStyle = copy(MODERN_STYLE_RULE_SET);
