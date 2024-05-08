import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Regression test for increment/decrement`, () => {
  it(`[auto generated] operators`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `a = 5`,
      ``,
      `a++`,
      ``,
      `++a`,
      ``,
      `a++`,
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
        end: { match: ['end'], pos: [8, 0, 3] },
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
            type: 1,
            name: 85,
            pos: [1, 0, 1],
            match: ['a'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 2, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [1, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [3, 0, 1],
            match: ['a'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 59,
            pos: [3, 1, 2],
            match: ['++'],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [3, 3, 0], match: [''] },
            kids: [],
          },
          {
            type: 0,
            name: 59,
            pos: [5, 0, 2],
            match: ['++'],
            idx: 5,
            scope: [54],
            parseProblems: [],
            end: { pos: [5, 3, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [5, 2, 1],
                match: ['a'],
                idx: 0,
                scope: [54, 59],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [7, 0, 1],
            match: ['a'],
            idx: 6,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 59,
            pos: [7, 1, 2],
            match: ['++'],
            idx: 7,
            scope: [54],
            parseProblems: [],
            end: { pos: [7, 3, 0], match: [''] },
            kids: [],
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
