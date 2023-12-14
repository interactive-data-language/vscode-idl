import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { Position } from 'vscode-languageserver/node';

describe(`[auto generated] Correctly identifies keywords from routine calls`, () => {
  it(`[auto generated] extract correct tokens and handle undefined`, () => {
    // test code to extract tokens from
    const code = [
      `; main level`,
      `r = ENVIRaster(NCOLUMNS = nCols, NROWS = nrows)`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define position
    const position_0: Position = { line: 1, character: 20 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 1,
      name: 28,
      pos: [1, 15, 8],
      match: ['NCOLUMNS'],
      idx: 0,
      scope: [54, 3, 8],
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
    const position_1: Position = { line: 1, character: 35 };

    // define expected token we extract
    const expectedFound_1 = {
      type: 1,
      name: 28,
      pos: [1, 33, 5],
      match: ['NROWS'],
      idx: 3,
      scope: [54, 3, 8],
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
