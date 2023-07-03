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

  // make all of the rules
  for (let i = 0; i < end - start; i++) {
    /** Reverse count so we have a prioritized rule sets */
    const j = end - i;

    rules.push({
      beforeText: new RegExp(`^\\s*; {${j}}.*$`),
      previousLineText: COMMENT_PREVIOUS_REGEX,
      action: {
        appendText: '; ' + new Array(j - 1).fill(' ').join(''),
        indentAction: IndentAction.None,
      },
    });
  }

  rules.push({
    beforeText: new RegExp(`^\\s*;+.*$`),
    previousLineText: COMMENT_PREVIOUS_REGEX,
    action: {
      appendText: ';',
      indentAction: IndentAction.None,
    },
  });

  rules.push({
    beforeText: new RegExp(`^\\s*;.*$`),
    previousLineText: COMMENT_PREVIOUS_REGEX,
    action: {
      appendText: ';',
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
export const ON_ENTER_COMMENTS: OnEnterRule[] = [...MakeOnEnterRules(1, 20)];
