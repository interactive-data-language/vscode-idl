import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { Position } from 'vscode-languageserver/node';

describe(`[auto generated] Correctly identifies search terms from syntax tree`, () => {
  it(`[auto generated] extract correct tokens with multiple parent routines`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc2`,
      `  compile_opt idl2`,
      `  a = 42`,
      `  return,1`,
      `end`,
      ``,
      `function myfunc1`,
      `  compile_opt idl2`,
      `  a = 17`,
      `  return,1`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define position
    const position_0: Position = { line: 2, character: 2 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 1,
      name: 85,
      pos: [2, 2, 1],
      match: ['a'],
      idx: 2,
      scope: [69],
      parseProblems: [],
      cache: {},
    };

    // get selected
    const selected_0 = GetTokenAtCursor(tokenized, position_0);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_0.token).toEqual(expectedFound_0);

    // define position
    const position_1: Position = { line: 8, character: 2 };

    // define expected token we extract
    const expectedFound_1 = {
      type: 1,
      name: 85,
      pos: [8, 2, 1],
      match: ['a'],
      idx: 2,
      scope: [69],
      parseProblems: [],
      cache: {},
    };

    // get selected
    const selected_1 = GetTokenAtCursor(tokenized, position_1);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_1.token).toEqual(expectedFound_1);
  });
});
