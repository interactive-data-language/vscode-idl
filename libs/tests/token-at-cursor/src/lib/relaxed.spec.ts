import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { Position } from 'vscode-languageserver/node';

describe(`[auto generated] Correctly use relaxed options for hover help`, () => {
  it(`[auto generated] at end of assignment`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc1`,
      `  compile_opt idl2`,
      `  a = `,
      `  return,1`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define position
    const position_0: Position = { line: 2, character: 5 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 0,
      name: 3,
      pos: [2, 4, 1],
      match: ['='],
      idx: 3,
      scope: [69],
      parseProblems: [68],
      end: { pos: [2, 6, 0], match: [''] },
      kids: [],
      cache: {},
    };

    // get selected
    const selected_0 = GetTokenAtCursor(tokenized, position_0);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_0.token).toEqual(expectedFound_0);

    // define position
    const position_1: Position = { line: 8, character: 6 };

    // define expected token we extract
    const expectedFound_1 = undefined;

    // get selected
    const selected_1 = GetTokenAtCursor(tokenized, position_1);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_1.token).toEqual(expectedFound_1);
  });
});
