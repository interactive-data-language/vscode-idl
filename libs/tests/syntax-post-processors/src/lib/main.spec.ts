import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly maps main level tokens`, () => {
  it(`[auto generated] do nothing without main level`, () => {
    // test code to extract tokens from
    const code = [`function myfunc`, `compile_opt idl2`, `  return,1`, `end`];

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
        end: { pos: [3, 0, 3], match: ['end'] },
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
          },
          {
            type: 0,
            name: 20,
            pos: [1, 0, 11],
            match: ['compile_opt'],
            idx: 1,
            scope: [69],
            parseProblems: [],
            end: { pos: [1, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [1, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [69, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
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

  it(`[auto generated] process single-line code 1`, () => {
    // test code to extract tokens from
    const code = [`a = plot(/TEST)`];

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
            end: { pos: [0, 15, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [0, 4, 5],
                match: ['plot(', 'plot'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 14, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 29,
                    pos: [0, 9, 5],
                    match: ['/TEST', 'TEST'],
                    idx: 0,
                    scope: [54, 3, 8],
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
    const expectedProblems: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] process single-line code 2`, () => {
    // test code to extract tokens from
    const code = [`a = \`\${42, '42'}\${42, '42'}\``];

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
            end: { pos: [0, 28, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 75,
                pos: [0, 4, 1],
                match: ['`'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 27, 1], match: ['`'] },
                kids: [
                  {
                    type: 0,
                    name: 74,
                    pos: [0, 5, 2],
                    match: ['${'],
                    idx: 0,
                    scope: [54, 3, 75],
                    parseProblems: [],
                    end: { pos: [0, 15, 1], match: ['}'] },
                    kids: [
                      {
                        type: 1,
                        name: 56,
                        pos: [0, 7, 2],
                        match: ['42'],
                        idx: 0,
                        scope: [54, 3, 75, 74],
                        parseProblems: [],
                      },
                      {
                        type: 1,
                        name: 14,
                        pos: [0, 9, 1],
                        match: [','],
                        idx: 1,
                        scope: [54, 3, 75, 74],
                        parseProblems: [],
                      },
                      {
                        type: 1,
                        name: 68,
                        pos: [0, 11, 4],
                        match: ["'42'", '42'],
                        idx: 2,
                        scope: [54, 3, 75, 74],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 0,
                    name: 74,
                    pos: [0, 16, 2],
                    match: ['${'],
                    idx: 1,
                    scope: [54, 3, 75],
                    parseProblems: [],
                    end: { pos: [0, 26, 1], match: ['}'] },
                    kids: [
                      {
                        type: 1,
                        name: 56,
                        pos: [0, 18, 2],
                        match: ['42'],
                        idx: 0,
                        scope: [54, 3, 75, 74],
                        parseProblems: [],
                      },
                      {
                        type: 1,
                        name: 14,
                        pos: [0, 20, 1],
                        match: [','],
                        idx: 1,
                        scope: [54, 3, 75, 74],
                        parseProblems: [],
                      },
                      {
                        type: 1,
                        name: 68,
                        pos: [0, 22, 4],
                        match: ["'42'", '42'],
                        idx: 2,
                        scope: [54, 3, 75, 74],
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

  it(`[auto generated] catch correct`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `compile_opt idl2`,
      `; main level`,
      `something = 42`,
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
        end: { pos: [3, 0, 3], match: ['end'] },
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
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
                idx: 1,
                scope: [69, 11],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 0,
        name: 54,
        pos: [5, 0, 11],
        idx: 1,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [8, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [5, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [5, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [5, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 15,
            pos: [6, 0, 12],
            match: ['; main level'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 1,
            name: 85,
            pos: [7, 0, 9],
            match: ['something'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [7, 10, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [7, 14, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [7, 12, 2],
                match: ['42'],
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

  it(`[auto generated] catch with no end`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `compile_opt idl2`,
      `; main level`,
      `something = 42`,
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
        end: { pos: [3, 0, 3], match: ['end'] },
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
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
                idx: 1,
                scope: [69, 11],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 0,
        name: 54,
        pos: [5, 0, 11],
        idx: 1,
        match: [],
        scope: [],
        parseProblems: [33],
        kids: [
          {
            type: 0,
            name: 20,
            pos: [5, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [5, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [5, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 15,
            pos: [6, 0, 12],
            match: ['; main level'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 1,
            name: 85,
            pos: [7, 0, 9],
            match: ['something'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [7, 10, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [7, 14, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [7, 12, 2],
                match: ['42'],
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [7, 0, 1.7976931348623157e308],
        end: [7, 0, 1.7976931348623157e308],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] catch with statements after the end`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `compile_opt idl2`,
      `; main level`,
      `something = 42`,
      `end`,
      `; bad comment`,
      `something = else`,
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
        end: { pos: [3, 0, 3], match: ['end'] },
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
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
                idx: 1,
                scope: [69, 11],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 0,
        name: 54,
        pos: [5, 0, 11],
        idx: 1,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [8, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [5, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [5, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [5, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 15,
            pos: [6, 0, 12],
            match: ['; main level'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 1,
            name: 85,
            pos: [7, 0, 9],
            match: ['something'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [7, 10, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [7, 14, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [7, 12, 2],
                match: ['42'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 1,
        name: 15,
        pos: [9, 0, 13],
        match: ['; bad comment'],
        idx: 2,
        scope: [],
        parseProblems: [],
      },
      {
        type: 1,
        name: 85,
        pos: [10, 0, 9],
        match: ['something'],
        idx: 3,
        scope: [],
        parseProblems: [3],
      },
      {
        type: 0,
        name: 3,
        pos: [10, 10, 1],
        match: ['='],
        idx: 4,
        scope: [],
        parseProblems: [3, 68],
        end: { pos: [10, 12, 0], match: [''] },
        kids: [],
      },
      {
        type: 0,
        name: 11,
        pos: [10, 12, 4],
        match: ['else'],
        idx: 5,
        scope: [],
        parseProblems: [3],
        end: { pos: [10, 16, 0], match: [''] },
        kids: [],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [10, 0, 9],
        end: [10, 0, 9],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [10, 10, 1],
        end: [10, 10, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [10, 12, 0],
        end: [10, 12, 0],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [10, 12, 4],
        end: [10, 12, 4],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [10, 16, 0],
        end: [10, 16, 0],
      },
      {
        code: 68,
        info: 'Expected IDL statement or expression after, but none was found',
        start: [10, 10, 1],
        end: [10, 12, 0],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] ignore only comments 1`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `; main level`,
      `; another comment`,
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
        end: { pos: [3, 0, 3], match: ['end'] },
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
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
                idx: 1,
                scope: [69, 11],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 1,
        name: 15,
        pos: [5, 0, 12],
        match: ['; main level'],
        idx: 1,
        scope: [],
        parseProblems: [],
      },
      {
        type: 1,
        name: 15,
        pos: [6, 0, 17],
        match: ['; another comment'],
        idx: 2,
        scope: [],
        parseProblems: [],
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

  it(`[auto generated] ignore only comments 2`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end ; -----------`,
      ``,
      `; main level`,
      `; another comment`,
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
        end: { pos: [3, 0, 3], match: ['end'] },
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
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
                idx: 1,
                scope: [69, 11],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 1,
        name: 15,
        pos: [3, 4, 13],
        match: ['; -----------'],
        idx: 1,
        scope: [],
        parseProblems: [],
      },
      {
        type: 1,
        name: 15,
        pos: [5, 0, 12],
        match: ['; main level'],
        idx: 2,
        scope: [],
        parseProblems: [],
      },
      {
        type: 1,
        name: 15,
        pos: [6, 0, 17],
        match: ['; another comment'],
        idx: 3,
        scope: [],
        parseProblems: [],
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

  it(`[auto generated] edge case`, () => {
    // test code to extract tokens from
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `!null = myfunc()`,
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
        end: { pos: [3, 0, 3], match: ['end'] },
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
            name: 11,
            pos: [2, 2, 6],
            match: ['return'],
            idx: 2,
            scope: [69],
            parseProblems: [],
            end: { pos: [2, 10, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [2, 8, 1],
                match: [','],
                idx: 0,
                scope: [69, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 56,
                pos: [2, 9, 1],
                match: ['1'],
                idx: 1,
                scope: [69, 11],
                parseProblems: [],
              },
            ],
          },
        ],
      },
      {
        type: 0,
        name: 54,
        pos: [5, 0, 5],
        idx: 1,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 82,
            pos: [5, 0, 5],
            match: ['!null'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [5, 6, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [5, 16, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [5, 8, 7],
                match: ['myfunc(', 'myfunc'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [5, 15, 1], match: [')'] },
                kids: [],
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
