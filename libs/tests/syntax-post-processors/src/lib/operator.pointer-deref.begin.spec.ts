import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] id in begin`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      ``,
      `val = ptr_new()`,
      ``,
      `if (!true) then begin`,
      `  *val = 5`,
      ``,
      `  *(val) = 5`,
      `endif`,
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
        end: { match: ['end'], pos: [9, 0, 3] },
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
            pos: [2, 0, 3],
            match: ['val'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [2, 4, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 15, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [2, 6, 8],
                match: ['ptr_new(', 'ptr_new'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [2, 14, 1], match: [')'] },
                kids: [],
              },
            ],
          },
          {
            type: 0,
            name: 41,
            pos: [4, 0, 2],
            match: ['if'],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [8, 5, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 64,
                pos: [4, 3, 1],
                match: ['('],
                idx: 0,
                scope: [54, 41],
                parseProblems: [],
                end: { pos: [4, 9, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 82,
                    pos: [4, 4, 5],
                    match: ['!true'],
                    idx: 0,
                    scope: [54, 41, 64],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 46,
                pos: [4, 11, 4],
                match: ['then'],
                idx: 1,
                scope: [54, 41],
                parseProblems: [],
                end: { pos: [8, 5, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 6,
                    pos: [4, 16, 5],
                    match: ['begin'],
                    idx: 0,
                    scope: [54, 41, 46],
                    parseProblems: [],
                    end: { pos: [8, 0, 5], match: ['endif'] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [5, 2, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 41, 46, 6],
                        parseProblems: [],
                        end: { pos: [5, 10, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [5, 3, 3],
                            match: ['val'],
                            idx: 0,
                            scope: [54, 41, 46, 6, 63],
                            parseProblems: [],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [5, 7, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 41, 46, 6, 63],
                            parseProblems: [],
                            end: { pos: [5, 10, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [5, 9, 1],
                                match: ['5'],
                                idx: 0,
                                scope: [54, 41, 46, 6, 63, 3],
                                parseProblems: [],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 0,
                        name: 63,
                        pos: [7, 2, 1],
                        match: ['*'],
                        idx: 1,
                        scope: [54, 41, 46, 6],
                        parseProblems: [],
                        end: { pos: [7, 12, 0], match: [''] },
                        kids: [
                          {
                            type: 0,
                            name: 64,
                            pos: [7, 3, 1],
                            match: ['('],
                            idx: 0,
                            scope: [54, 41, 46, 6, 63],
                            parseProblems: [],
                            end: { pos: [7, 7, 1], match: [')'] },
                            kids: [
                              {
                                type: 1,
                                name: 85,
                                pos: [7, 4, 3],
                                match: ['val'],
                                idx: 0,
                                scope: [54, 41, 46, 6, 63, 64],
                                parseProblems: [],
                              },
                            ],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [7, 9, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 41, 46, 6, 63],
                            parseProblems: [],
                            end: { pos: [7, 12, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [7, 11, 1],
                                match: ['5'],
                                idx: 0,
                                scope: [54, 41, 46, 6, 63, 3],
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
