import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { Position } from 'vscode-languageserver/node';

describe(`[auto generated] Find the right token when we do/don't have anything selected`, () => {
  it(`[auto generated] with a branch token`, () => {
    // test code to extract tokens from
    const code = [`args.setData,   `, `end`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define position
    const position_0: Position = { line: 0, character: 12 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 1,
      name: 14,
      pos: [0, 12, 1],
      match: [','],
      idx: 0,
      scope: [54, 12],
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
    const position_1: Position = { line: 0, character: 13 };

    // define expected token we extract
    const expectedFound_1 = {
      type: 1,
      name: 14,
      pos: [0, 12, 1],
      match: [','],
      idx: 0,
      scope: [54, 12],
      parseProblems: [],
      cache: {},
    };

    // get selected
    const selected_1 = GetTokenAtCursor(tokenized, position_1);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_1.token).toEqual(expectedFound_1);

    // define position
    const position_2: Position = { line: 0, character: 14 };

    // define expected token we extract
    const expectedFound_2 = {
      type: 0,
      name: 12,
      pos: [0, 4, 8],
      match: ['.setData', '.', 'setData'],
      idx: 1,
      scope: [54],
      parseProblems: [],
      end: { pos: [0, 16, 0], match: [''] },
      kids: [
        {
          type: 1,
          name: 14,
          pos: [0, 12, 1],
          match: [','],
          idx: 0,
          scope: [54, 12],
          parseProblems: [],
          cache: {},
        },
      ],
      cache: {},
    };

    // get selected
    const selected_2 = GetTokenAtCursor(tokenized, position_2);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_2.token).toEqual(expectedFound_2);

    // define position
    const position_3: Position = { line: 0, character: 15 };

    // define expected token we extract
    const expectedFound_3 = {
      type: 0,
      name: 12,
      pos: [0, 4, 8],
      match: ['.setData', '.', 'setData'],
      idx: 1,
      scope: [54],
      parseProblems: [],
      end: { pos: [0, 16, 0], match: [''] },
      kids: [
        {
          type: 1,
          name: 14,
          pos: [0, 12, 1],
          match: [','],
          idx: 0,
          scope: [54, 12],
          parseProblems: [],
          cache: {},
        },
      ],
      cache: {},
    };

    // get selected
    const selected_3 = GetTokenAtCursor(tokenized, position_3);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_3.token).toEqual(expectedFound_3);

    // define position
    const position_4: Position = { line: 0, character: 16 };

    // define expected token we extract
    const expectedFound_4 = {
      type: 0,
      name: 12,
      pos: [0, 4, 8],
      match: ['.setData', '.', 'setData'],
      idx: 1,
      scope: [54],
      parseProblems: [],
      end: { pos: [0, 16, 0], match: [''] },
      kids: [
        {
          type: 1,
          name: 14,
          pos: [0, 12, 1],
          match: [','],
          idx: 0,
          scope: [54, 12],
          parseProblems: [],
          cache: {},
        },
      ],
      cache: {},
    };

    // get selected
    const selected_4 = GetTokenAtCursor(tokenized, position_4);

    // remove scope detail
    RemoveScopeDetail(tokenized, new CancellationToken());

    // verify results
    expect(selected_4.token).toEqual(expectedFound_4);
  });
});
