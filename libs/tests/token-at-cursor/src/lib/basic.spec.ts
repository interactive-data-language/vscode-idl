import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { Position } from 'vscode-languageserver/node';

describe(`[auto generated] Correctly identifies search terms from syntax tree`, () => {
  it(`[auto generated] extract correct tokens and handle undefined`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  return,1`,
      `end`,
      ``,
      `; main level`,
      `something = 42`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define position
    const position_0: Position = { line: 0, character: 0 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 0,
      name: 69,
      pos: [0, 0, 9],
      match: ['function ', 'function'],
      idx: 0,
      scope: [],
      parseProblems: [38],
      end: { pos: [2, 0, 3], match: ['end'] },
      kids: [
        {
          type: 0,
          name: 71,
          pos: [0, 9, 6],
          match: ['myfunc'],
          idx: 0,
          scope: [69],
          parseProblems: [],
          end: { pos: [0, 15, 0], match: [''] },
          kids: [],
          cache: {},
        },
        {
          type: 0,
          name: 11,
          pos: [1, 2, 6],
          match: ['return'],
          idx: 1,
          scope: [69],
          parseProblems: [],
          end: { pos: [1, 10, 0], match: [''] },
          kids: [
            {
              type: 1,
              name: 14,
              pos: [1, 8, 1],
              match: [','],
              idx: 0,
              scope: [69, 11],
              parseProblems: [],
              cache: {},
            },
            {
              type: 1,
              name: 56,
              pos: [1, 9, 1],
              match: ['1'],
              idx: 1,
              scope: [69, 11],
              parseProblems: [],
              cache: {},
            },
          ],
          cache: {},
        },
      ],
      cache: {},
    };

    // get selected
    const selected_0 = GetTokenAtCursor(tokenized, position_0);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_0.token).toEqual(expectedFound_0);

    // define position
    const position_1: Position = { line: 3, character: 0 };

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
