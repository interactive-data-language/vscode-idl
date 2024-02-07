import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] in for loop statements`, () => {
    // test code to extract tokens from
    const code = [`for i=*var, *other do *val = 42`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 3],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 0,
            name: 49,
            pos: [0, 0, 3],
            match: ['for'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 31, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [0, 4, 1],
                match: ['i'],
                idx: 0,
                scope: [54, 49],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [0, 5, 1],
                match: ['='],
                idx: 1,
                scope: [54, 49],
                parseProblems: [],
                end: { pos: [0, 10, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 6, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 49, 3],
                    parseProblems: [],
                    end: { pos: [0, 10, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 7, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 49, 3, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 10, 1],
                match: [','],
                idx: 2,
                scope: [54, 49],
                parseProblems: [],
              },
              {
                type: 0,
                name: 63,
                pos: [0, 12, 1],
                match: ['*'],
                idx: 3,
                scope: [54, 49],
                parseProblems: [],
                end: { pos: [0, 19, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 13, 5],
                    match: ['other'],
                    idx: 0,
                    scope: [54, 49, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 48,
                pos: [0, 19, 2],
                match: ['do'],
                idx: 4,
                scope: [54, 49],
                parseProblems: [],
                end: { pos: [0, 31, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 22, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 49, 48],
                    parseProblems: [],
                    end: { pos: [0, 31, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 23, 3],
                        match: ['val'],
                        idx: 0,
                        scope: [54, 49, 48, 63],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 3,
                        pos: [0, 27, 1],
                        match: ['='],
                        idx: 1,
                        scope: [54, 49, 48, 63],
                        parseProblems: [],
                        end: { pos: [0, 31, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [0, 29, 2],
                            match: ['42'],
                            idx: 0,
                            scope: [54, 49, 48, 63, 3],
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

  it(`[auto generated] in foreach loop statements`, () => {
    // test code to extract tokens from
    const code = [`foreach val, *thing, key do *val = 42`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 7],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 0,
            name: 50,
            pos: [0, 0, 7],
            match: ['foreach'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 37, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [0, 8, 3],
                match: ['val'],
                idx: 0,
                scope: [54, 50],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 11, 1],
                match: [','],
                idx: 1,
                scope: [54, 50],
                parseProblems: [],
              },
              {
                type: 0,
                name: 63,
                pos: [0, 13, 1],
                match: ['*'],
                idx: 2,
                scope: [54, 50],
                parseProblems: [],
                end: { pos: [0, 19, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 14, 5],
                    match: ['thing'],
                    idx: 0,
                    scope: [54, 50, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 19, 1],
                match: [','],
                idx: 3,
                scope: [54, 50],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [0, 21, 3],
                match: ['key'],
                idx: 4,
                scope: [54, 50],
                parseProblems: [],
              },
              {
                type: 0,
                name: 48,
                pos: [0, 25, 2],
                match: ['do'],
                idx: 5,
                scope: [54, 50],
                parseProblems: [],
                end: { pos: [0, 37, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 28, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 50, 48],
                    parseProblems: [],
                    end: { pos: [0, 37, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 29, 3],
                        match: ['val'],
                        idx: 0,
                        scope: [54, 50, 48, 63],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 3,
                        pos: [0, 33, 1],
                        match: ['='],
                        idx: 1,
                        scope: [54, 50, 48, 63],
                        parseProblems: [],
                        end: { pos: [0, 37, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [0, 35, 2],
                            match: ['42'],
                            idx: 0,
                            scope: [54, 50, 48, 63, 3],
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

  it(`[auto generated] in while loop statements`, () => {
    // test code to extract tokens from
    const code = [`while *var do *val = 42`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 5],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 0,
            name: 53,
            pos: [0, 0, 5],
            match: ['while'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 23, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 57,
                pos: [0, 6, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 53],
                parseProblems: [],
                end: { pos: [0, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 7, 3],
                    match: ['var'],
                    idx: 0,
                    scope: [54, 53, 57],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 48,
                pos: [0, 11, 2],
                match: ['do'],
                idx: 1,
                scope: [54, 53],
                parseProblems: [],
                end: { pos: [0, 23, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 14, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 53, 48],
                    parseProblems: [],
                    end: { pos: [0, 23, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 15, 3],
                        match: ['val'],
                        idx: 0,
                        scope: [54, 53, 48, 63],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 3,
                        pos: [0, 19, 1],
                        match: ['='],
                        idx: 1,
                        scope: [54, 53, 48, 63],
                        parseProblems: [],
                        end: { pos: [0, 23, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [0, 21, 2],
                            match: ['42'],
                            idx: 0,
                            scope: [54, 53, 48, 63, 3],
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

  it(`[auto generated] in repeat loop statements`, () => {
    // test code to extract tokens from
    const code = [`repeat *val = 42 until *var`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 6],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 0,
            name: 51,
            pos: [0, 0, 6],
            match: ['repeat'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 27, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 63,
                pos: [0, 7, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 51],
                parseProblems: [],
                end: { pos: [0, 17, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 8, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 51, 63],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [0, 12, 1],
                    match: ['='],
                    idx: 1,
                    scope: [54, 51, 63],
                    parseProblems: [],
                    end: { pos: [0, 17, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 56,
                        pos: [0, 14, 2],
                        match: ['42'],
                        idx: 0,
                        scope: [54, 51, 63, 3],
                        parseProblems: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 0,
                name: 52,
                pos: [0, 17, 5],
                match: ['until'],
                idx: 1,
                scope: [54, 51],
                parseProblems: [],
                end: { pos: [0, 27, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 23, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 51, 52],
                    parseProblems: [],
                    end: { pos: [0, 27, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 24, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 51, 52, 63],
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
