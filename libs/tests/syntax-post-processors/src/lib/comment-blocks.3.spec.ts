import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Confusing comment blocks `, () => {
  it(`[auto generated] ignore markdown lists`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+`,
      `; worlds greatest documenter`,
      `; - some bulleted list`,
      `; - some bulleted list`,
      `;-`,
      `a = 5`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [7, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [0, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [1, 0, 2],
            match: [
              ';+',
              '; worlds greatest documenter',
              '; - some bulleted list',
              '; - some bulleted list',
              ';-',
            ],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [5, 0, 2] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [1, 0, 2],
                match: [';+'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [2, 0, 28],
                match: ['; worlds greatest documenter'],
                idx: 1,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [3, 0, 22],
                match: ['; - some bulleted list'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [4, 0, 22],
                match: ['; - some bulleted list'],
                idx: 3,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [5, 0, 2],
                match: [';-'],
                idx: 4,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [6, 0, 1],
            match: ['a'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [6, 2, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [6, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [6, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
        ],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
