import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly identify array indexing`, () => {
  it(`[auto generated] all parts of ternary operators`, () => {
    // test code to extract tokens from
    const code = [`compile_opt idl2`, `subsel = sel[*, 1:*val]`, `end`];

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
        end: { match: ['end'], pos: [2, 0, 3] },
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
            pos: [1, 0, 6],
            match: ['subsel'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 7, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 23, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [1, 9, 3],
                match: ['sel'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 7,
                pos: [1, 12, 1],
                match: ['['],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [1, 22, 1], match: [']'] },
                kids: [
                  {
                    type: 0,
                    name: 60,
                    pos: [1, 13, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 7],
                    parseProblems: [],
                    end: { pos: [1, 14, 0], match: [''] },
                    kids: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 14, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 7],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 56,
                    pos: [1, 16, 1],
                    match: ['1'],
                    idx: 2,
                    scope: [54, 3, 7],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 13,
                    pos: [1, 17, 1],
                    match: [':'],
                    idx: 3,
                    scope: [54, 3, 7],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 63,
                    pos: [1, 18, 1],
                    match: ['*'],
                    idx: 4,
                    scope: [54, 3, 7],
                    parseProblems: [],
                    end: { pos: [1, 22, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [1, 19, 3],
                        match: ['val'],
                        idx: 0,
                        scope: [54, 3, 7, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                ],
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
