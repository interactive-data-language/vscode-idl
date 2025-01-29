import { ARG_KW_PROPERTY_TAG } from '@idl/parsing/syntax-tree';
import { IndentAction, OnEnterRule } from 'vscode';

/** Comment before cursor */
const COMMENT_BEFORE_REGEX = /^\s*;.*$/;

/** Comment on previous line */
const COMMENT_PREVIOUS_REGEX = /^\s*;.*$/;

/**
 * use code to make all of our enter rules
 */
function MakeOnEnterRules(start: number, end: number): OnEnterRule[] {
  /** Make our rules */
  const rules: OnEnterRule[] = [];

  /**
   * End of a comment block, no comment characters
   */
  rules.push({
    beforeText: new RegExp(`^\\s*;-.*$`),
    previousLineText: COMMENT_PREVIOUS_REGEX,
    action: {
      appendText: '',
      indentAction: IndentAction.None,
    },
  });

  /**
   * Single comment
   */
  rules.push({
    beforeText: /^\s*;.*$/,
    previousLineText: /^(?!\s*;).*$/,
    action: {
      appendText: '',
      indentAction: IndentAction.None,
    },
  });

  /**
   * After docs tag
   */
  rules.push({
    beforeText: ARG_KW_PROPERTY_TAG,
    previousLineText: COMMENT_PREVIOUS_REGEX,
    action: {
      appendText: ';   ',
      indentAction: IndentAction.None,
    },
  });

  for (let j = start; j < end + 1; j++) {
    // reverse because we need longest matches first
    const i = end + 1 - j;

    rules.push({
      beforeText: new RegExp(`^\\s*; {${i}}.*$`),
      previousLineText: COMMENT_PREVIOUS_REGEX,
      action: {
        appendText: ';' + new Array(i).fill(' ').join(''),
        indentAction: IndentAction.None,
      },
    });
  }

  /**
   * If we have a comment block on our line
   */
  rules.push({
    beforeText: new RegExp(`^\\s*;+.*$`),
    action: {
      appendText: '; ',
      indentAction: IndentAction.None,
    },
  });

  return rules;
}

/**
 * On enter for comments too make sure that we preserve indentation.
 *
 * Use OnEnter rules which are easy instead of adding complexity to the language server
 */
export const ON_ENTER_COMMENTS: OnEnterRule[] = [...MakeOnEnterRules(0, 20)];
