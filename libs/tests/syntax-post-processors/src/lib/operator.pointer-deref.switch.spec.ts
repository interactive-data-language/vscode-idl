import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] all parts of switch statement`, () => {
    // test code to extract tokens from
    const code = [
      ``,
      `compile_opt idl2`,
      `switch *val of`,
      `  *thing: *other = 42`,
      `  *thing2: *other = 42`,
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
        pos: [1, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [7, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [1, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [1, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 43,
            pos: [2, 0, 6],
            match: ['switch'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [6, 0, 7], match: ['endcase'] },
            kids: [
              {
                type: 0,
                name: 63,
                pos: [2, 7, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 43],
                parseProblems: [],
                end: { pos: [2, 12, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [2, 8, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 43, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 42,
                pos: [2, 12, 2],
                match: ['of'],
                idx: 1,
                scope: [54, 43],
                parseProblems: [],
                end: { pos: [6, 0, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [3, 2, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 43, 42],
                    parseProblems: [],
                    end: { pos: [3, 8, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [3, 3, 5],
                        match: ['thing'],
                        idx: 0,
                        scope: [54, 43, 42, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 0,
                    name: 37,
                    pos: [3, 8, 1],
                    match: [':'],
                    idx: 1,
                    scope: [54, 43, 42],
                    parseProblems: [],
                    end: { pos: [3, 21, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [3, 10, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 43, 42, 37],
                        parseProblems: [],
                        end: { pos: [3, 21, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [3, 11, 5],
                            match: ['other'],
                            idx: 0,
                            scope: [54, 43, 42, 37, 63],
                            parseProblems: [],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [3, 17, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 43, 42, 37, 63],
                            parseProblems: [],
                            end: { pos: [3, 21, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [3, 19, 2],
                                match: ['42'],
                                idx: 0,
                                scope: [54, 43, 42, 37, 63, 3],
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
                    name: 63,
                    pos: [4, 2, 1],
                    match: ['*'],
                    idx: 2,
                    scope: [54, 43, 42],
                    parseProblems: [],
                    end: { pos: [4, 9, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [4, 3, 6],
                        match: ['thing2'],
                        idx: 0,
                        scope: [54, 43, 42, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 0,
                    name: 37,
                    pos: [4, 9, 1],
                    match: [':'],
                    idx: 3,
                    scope: [54, 43, 42],
                    parseProblems: [],
                    end: { pos: [4, 22, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [4, 11, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 43, 42, 37],
                        parseProblems: [],
                        end: { pos: [4, 22, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [4, 12, 5],
                            match: ['other'],
                            idx: 0,
                            scope: [54, 43, 42, 37, 63],
                            parseProblems: [],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [4, 18, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 43, 42, 37, 63],
                            parseProblems: [],
                            end: { pos: [4, 22, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [4, 20, 2],
                                match: ['42'],
                                idx: 0,
                                scope: [54, 43, 42, 37, 63, 3],
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
                    pos: [5, 2, 5],
                    match: ['else:', 'else'],
                    idx: 4,
                    scope: [54, 43, 42],
                    parseProblems: [],
                    end: { pos: [5, 19, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [5, 8, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 43, 42, 40],
                        parseProblems: [],
                        end: { pos: [5, 19, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [5, 9, 5],
                            match: ['value'],
                            idx: 0,
                            scope: [54, 43, 42, 40, 63],
                            parseProblems: [],
                          },
                          {
                            type: 0,
                            name: 3,
                            pos: [5, 15, 1],
                            match: ['='],
                            idx: 1,
                            scope: [54, 43, 42, 40, 63],
                            parseProblems: [],
                            end: { pos: [5, 19, 0], match: [''] },
                            kids: [
                              {
                                type: 1,
                                name: 56,
                                pos: [5, 17, 2],
                                match: ['84'],
                                idx: 0,
                                scope: [54, 43, 42, 40, 63, 3],
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
