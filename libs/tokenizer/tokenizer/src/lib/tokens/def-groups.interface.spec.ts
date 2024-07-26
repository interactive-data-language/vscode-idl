import {
  ALL_TOKENS,
  CASE_SWITCH_EXPRESSION_TOKENS,
  CASE_SWITCH_TOKENS,
  CONTROL_COMPOUND_TOKENS,
  DEFAULT_TOKENS,
  LOOP_TOKENS,
  NAMED_STRUCTURE_TOKENS,
  ROUTINE_NAME_TOKENS,
  ROUTINE_TOKENS,
  STRUCTURE_TOKENS,
  TERNARY_TOKENS,
} from './def-groups.interface';
import {
  COMMENT_ONLY_TEST,
  IDL_ARG_KW_END,
  IDL_ASSIGNMENT_END,
  IDL_BLOCK_END,
  IDL_LINE_END,
  IDL_LOGICAL_STATEMENT_END,
  IDL_OPERATOR_END,
  IDL_PRO_END,
  IDL_STATEMENT_END,
  NON_SPACE_CHARACTER,
} from './regex.interface';
import { SUB_DEFS } from './sub-defs.interface';

describe('Validates all tokens are NOT global', () => {
  it('validates constants', () => {
    // load all customized groups
    const groups = [
      ALL_TOKENS,
      DEFAULT_TOKENS,
      ROUTINE_TOKENS,
      LOOP_TOKENS,
      ROUTINE_NAME_TOKENS,
      STRUCTURE_TOKENS,
      NAMED_STRUCTURE_TOKENS,
      CASE_SWITCH_TOKENS,
      CASE_SWITCH_EXPRESSION_TOKENS,
      TERNARY_TOKENS,
      CONTROL_COMPOUND_TOKENS,
    ];

    // process each group
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      // process tokens in each group
      for (let j = 0; j < group.length; j++) {
        // check the start
        expect(group[j].match.global).toBeFalsy();

        // check end if not basic
        if (!group[j].match) {
          expect(group[j].end.global).toBeFalsy();
        }
      }
    }
  });

  it('validates all sub defs', () => {
    const groups = Object.keys(SUB_DEFS);

    // process each group
    for (let i = 0; i < groups.length; i++) {
      const group = SUB_DEFS[groups[i]];

      // process tokens in each group
      for (let j = 0; j < group.length; j++) {
        // check the start
        expect(group[j].match.global).toBeFalsy();

        // check end if not basic
        if (group[j].end !== undefined) {
          expect(group[j].end.global).toBeFalsy();
        }
      }
    }
  });

  it('validates standalone regex', () => {
    const exprs = [
      IDL_LINE_END,
      IDL_STATEMENT_END,
      IDL_BLOCK_END,
      IDL_LOGICAL_STATEMENT_END,
      IDL_ASSIGNMENT_END,
      IDL_OPERATOR_END,
      IDL_PRO_END,
      IDL_ARG_KW_END,
      COMMENT_ONLY_TEST,
      NON_SPACE_CHARACTER,
    ];

    // process tokens in each group
    for (let j = 0; j < exprs.length; j++) {
      // check the start
      expect(exprs[j].global).toBeFalsy();
    }
  });
});
