import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] in functions`, () => {
    // test code to extract tokens from
    const code = [`a = func(*val, *other, kw=*last)`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 1],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 1],
            match: ['a'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 2, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 32, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [0, 4, 5],
                match: ['func(', 'func'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 31, 1], match: [')'] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 9, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [0, 13, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 10, 3],
                        match: ['val'],
                        idx: 0,
                        scope: [54, 3, 8, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [0, 13, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 15, 1],
                    match: ['*'],
                    idx: 2,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [0, 21, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 16, 5],
                        match: ['other'],
                        idx: 0,
                        scope: [54, 3, 8, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [0, 21, 1],
                    match: [','],
                    idx: 3,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [0, 23, 2],
                    match: ['kw'],
                    idx: 4,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [0, 25, 1],
                    match: ['='],
                    idx: 5,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [0, 31, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [0, 26, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 3, 8, 3],
                        parseProblems: [],
                        end: { pos: [0, 31, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [0, 27, 4],
                            match: ['last'],
                            idx: 0,
                            scope: [54, 3, 8, 3, 63],
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

  it(`[auto generated] in function methods`, () => {
    // test code to extract tokens from
    const code = [`a = var.func(*val, *other, kw=*last)`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 1],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 1],
            match: ['a'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 2, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 36, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [0, 4, 3],
                match: ['var'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 9,
                pos: [0, 7, 6],
                match: ['.func(', '.', 'func', '('],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 35, 1], match: [')'] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 13, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [0, 17, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 14, 3],
                        match: ['val'],
                        idx: 0,
                        scope: [54, 3, 9, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [0, 17, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 19, 1],
                    match: ['*'],
                    idx: 2,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [0, 25, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 20, 5],
                        match: ['other'],
                        idx: 0,
                        scope: [54, 3, 9, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [0, 25, 1],
                    match: [','],
                    idx: 3,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [0, 27, 2],
                    match: ['kw'],
                    idx: 4,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [0, 29, 1],
                    match: ['='],
                    idx: 5,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [0, 35, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [0, 30, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 3, 9, 3],
                        parseProblems: [],
                        end: { pos: [0, 35, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [0, 31, 4],
                            match: ['last'],
                            idx: 0,
                            scope: [54, 3, 9, 3, 63],
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

  it(`[auto generated] in procedure definitions`, () => {
    // test code to extract tokens from
    const code = [
      `function mypro`,
      `  compile_opt idl2`,
      `  *val = 5`,
      `  *val2 = 5`,
      `  return, !null`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 69,
        pos: [0, 0, 9],
        match: ['function ', 'function'],
        idx: 0,
        scope: [],
        parseProblems: [],
        end: { pos: [5, 0, 3], match: ['end'] },
        kids: [
          {
            type: 0,
            name: 71,
            pos: [0, 9, 5],
            match: ['mypro'],
            idx: 0,
            scope: [69],
            parseProblems: [],
            end: { pos: [0, 14, 0], match: [''] },
            kids: [],
          },
          {
            type: 0,
            name: 20,
            pos: [1, 2, 11],
            match: ['compile_opt'],
            idx: 1,
            scope: [69],
            parseProblems: [],
            end: { pos: [1, 18, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [1, 14, 4],
                match: ['idl2'],
                idx: 0,
                scope: [69, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 63,
            pos: [2, 2, 1],
            match: ['*'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [2, 3, 3],
                match: ['val'],
                idx: 0,
                scope: [69, 63],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 7, 1],
                match: ['='],
                idx: 1,
                scope: [69, 63],
                parseProblems: [],
                end: { pos: [2, 10, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [2, 9, 1],
                    match: ['5'],
                    idx: 0,
                    scope: [69, 63, 3],
                    parseProblems: [],
                  },
                ],
              },
            ],
          },
          {
            type: 0,
            name: 63,
            pos: [3, 2, 1],
            match: ['*'],
            idx: 3,
            scope: [69],
            parseProblems: [],
            end: { pos: [3, 11, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [3, 3, 4],
                match: ['val2'],
                idx: 0,
                scope: [69, 63],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [3, 8, 1],
                match: ['='],
                idx: 1,
                scope: [69, 63],
                parseProblems: [],
                end: { pos: [3, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [3, 10, 1],
                    match: ['5'],
                    idx: 0,
                    scope: [69, 63, 3],
                    parseProblems: [],
                  },
                ],
              },
            ],
          },
          {
            type: 0,
            name: 11,
            pos: [4, 2, 6],
            match: ['return'],
            idx: 4,
            scope: [69],
            parseProblems: [],
            end: { pos: [4, 15, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [4, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 82,
                pos: [4, 10, 5],
                match: ['!null'],
                idx: 1,
                scope: [69, 11],
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

  it(`[auto generated] in procedures`, () => {
    // test code to extract tokens from
    const code = [`mypro, *val, *other, kw=*last`];

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
            name: 11,
            pos: [0, 0, 5],
            match: ['mypro'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 29, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [0, 5, 1],
                match: [','],
                idx: 0,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 63,
                pos: [0, 7, 1],
                match: ['*'],
                idx: 1,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [0, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 8, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 11, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 11, 1],
                match: [','],
                idx: 2,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 63,
                pos: [0, 13, 1],
                match: ['*'],
                idx: 3,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [0, 19, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 14, 5],
                    match: ['other'],
                    idx: 0,
                    scope: [54, 11, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 19, 1],
                match: [','],
                idx: 4,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [0, 21, 2],
                match: ['kw'],
                idx: 5,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [0, 23, 1],
                match: ['='],
                idx: 6,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [0, 29, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 24, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 11, 3],
                    parseProblems: [],
                    end: { pos: [0, 29, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 25, 4],
                        match: ['last'],
                        idx: 0,
                        scope: [54, 11, 3, 63],
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

  it(`[auto generated] in procedure methods`, () => {
    // test code to extract tokens from
    const code = [`var.mypro, *val, *other, kw=*last`];

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
            type: 1,
            name: 85,
            pos: [0, 0, 3],
            match: ['var'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 12,
            pos: [0, 3, 6],
            match: ['.mypro', '.', 'mypro'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 33, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [0, 9, 1],
                match: [','],
                idx: 0,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 63,
                pos: [0, 11, 1],
                match: ['*'],
                idx: 1,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [0, 15, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 12, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 12, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 15, 1],
                match: [','],
                idx: 2,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 63,
                pos: [0, 17, 1],
                match: ['*'],
                idx: 3,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [0, 23, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 18, 5],
                    match: ['other'],
                    idx: 0,
                    scope: [54, 12, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 23, 1],
                match: [','],
                idx: 4,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [0, 25, 2],
                match: ['kw'],
                idx: 5,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [0, 27, 1],
                match: ['='],
                idx: 6,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [0, 33, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 28, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 12, 3],
                    parseProblems: [],
                    end: { pos: [0, 33, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 29, 4],
                        match: ['last'],
                        idx: 0,
                        scope: [54, 12, 3, 63],
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

  it(`[auto generated] in multi-line procedures`, () => {
    // test code to extract tokens from
    const code = [`mypro,$`, `  *val`, `end`];

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
        parseProblems: [38],
        end: { match: ['end'], pos: [2, 0, 3] },
        kids: [
          {
            type: 0,
            name: 11,
            pos: [0, 0, 5],
            match: ['mypro'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 6, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [0, 5, 1],
                match: [','],
                idx: 0,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [0, 6, 1],
                match: ['$'],
                idx: 1,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [0, 7, 0], match: [''] },
                kids: [],
              },
              {
                type: 0,
                name: 57,
                pos: [1, 2, 1],
                match: ['*'],
                idx: 2,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [1, 6, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 3, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 11, 57],
                    parseProblems: [],
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 5],
        end: [0, 0, 5],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in procedure definitions`, () => {
    // test code to extract tokens from
    const code = [
      `pro mypro`,
      `compile_opt idl2`,
      `  *val = 5`,
      `  *val2 = 5`,
      `  return`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 72,
        pos: [0, 0, 4],
        match: ['pro ', 'pro'],
        idx: 0,
        scope: [],
        parseProblems: [],
        end: { pos: [5, 0, 3], match: ['end'] },
        kids: [
          {
            type: 0,
            name: 71,
            pos: [0, 4, 5],
            match: ['mypro'],
            idx: 0,
            scope: [72],
            parseProblems: [],
            end: { pos: [0, 9, 0], match: [''] },
            kids: [],
          },
          {
            type: 0,
            name: 20,
            pos: [1, 0, 11],
            match: ['compile_opt'],
            idx: 1,
            scope: [72],
            parseProblems: [],
            end: { pos: [1, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [1, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [72, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 63,
            pos: [2, 2, 1],
            match: ['*'],
            idx: 2,
            scope: [72],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [2, 3, 3],
                match: ['val'],
                idx: 0,
                scope: [72, 63],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 7, 1],
                match: ['='],
                idx: 1,
                scope: [72, 63],
                parseProblems: [],
                end: { pos: [2, 10, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [2, 9, 1],
                    match: ['5'],
                    idx: 0,
                    scope: [72, 63, 3],
                    parseProblems: [],
                  },
                ],
              },
            ],
          },
          {
            type: 0,
            name: 63,
            pos: [3, 2, 1],
            match: ['*'],
            idx: 3,
            scope: [72],
            parseProblems: [],
            end: { pos: [3, 11, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [3, 3, 4],
                match: ['val2'],
                idx: 0,
                scope: [72, 63],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [3, 8, 1],
                match: ['='],
                idx: 1,
                scope: [72, 63],
                parseProblems: [],
                end: { pos: [3, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [3, 10, 1],
                    match: ['5'],
                    idx: 0,
                    scope: [72, 63, 3],
                    parseProblems: [],
                  },
                ],
              },
            ],
          },
          {
            type: 0,
            name: 11,
            pos: [4, 2, 6],
            match: ['return'],
            idx: 4,
            scope: [72],
            parseProblems: [],
            end: { pos: [4, 8, 0], match: [''] },
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
