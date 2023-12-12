import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] all parts of case statement`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `case *val of`,
      `  *thing: *other = 42`,
      `  else: *value = 84`,
      `endcase`,
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
        end: { match: ['end'], pos: [5, 0, 3] },
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
            name: 36,
            pos: [1, 0, 4],
            match: ['case'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [4, 0, 7], match: ['endcase'] },
            kids: [
              {
                type: 0,
                name: 63,
                pos: [1, 5, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 36],
                parseProblems: [],
                end: { pos: [1, 10, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 6, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 36, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 42,
                pos: [1, 10, 2],
                match: ['of'],
                idx: 1,
                scope: [54, 36],
                parseProblems: [],
                end: { pos: [4, 0, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [2, 2, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 36, 42],
                    parseProblems: [],
                    end: { pos: [2, 8, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [2, 3, 5],
                        match: ['thing'],
                        idx: 0,
                        scope: [54, 36, 42, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 0,
                    name: 37,
                    pos: [2, 8, 1],
                    match: [':'],
                    idx: 1,
                    scope: [54, 36, 42],
                    parseProblems: [],
                    end: { pos: [2, 21, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [2, 10, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 36, 42, 37],
                        parseProblems: [],
                        end: { pos: [2, 21, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [2, 11, 5],
                            match: ['other'],
                            idx: 0,
                            scope: [54, 36, 42, 37, 63],
                            parseProblems: [],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [2, 17, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 36, 42, 37, 63],
                            parseProblems: [],
                            end: { pos: [2, 21, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [2, 19, 2],
                                match: ['42'],
                                idx: 0,
                                scope: [54, 36, 42, 37, 63, 3],
                                parseProblems: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 0,
                    name: 40,
                    pos: [3, 2, 5],
                    match: ['else:', 'else'],
                    idx: 2,
                    scope: [54, 36, 42],
                    parseProblems: [],
                    end: { pos: [3, 19, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [3, 8, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 36, 42, 40],
                        parseProblems: [],
                        end: { pos: [3, 19, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [3, 9, 5],
                            match: ['value'],
                            idx: 0,
                            scope: [54, 36, 42, 40, 63],
                            parseProblems: [],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [3, 15, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 36, 42, 40, 63],
                            parseProblems: [],
                            end: { pos: [3, 19, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [3, 17, 2],
                                match: ['84'],
                                idx: 0,
                                scope: [54, 36, 42, 40, 63, 3],
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
