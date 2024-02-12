import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly extract keyword names from routine calls`, () => {
  it(`[auto generated] Convert variables to keywords when calling procedures`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
      `  KW2 = kw2, KW3 = kw3`,
      ``,
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
        end: { match: ['end'], pos: [4, 0, 3] },
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
            name: 11,
            pos: [1, 0, 5],
            match: ['mypro'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 22, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [1, 5, 1],
                match: [','],
                idx: 0,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 7, 4],
                match: ['arg1'],
                idx: 1,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 11, 1],
                match: [','],
                idx: 2,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 13, 4],
                match: ['arg2'],
                idx: 3,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 17, 1],
                match: [','],
                idx: 4,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 19, 4],
                match: ['arg3'],
                idx: 5,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 23, 1],
                match: [','],
                idx: 6,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [1, 25, 3],
                match: ['KW1'],
                idx: 7,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 28, 1],
                match: ['='],
                idx: 8,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [1, 32, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 29, 3],
                    match: ['kw1'],
                    idx: 0,
                    scope: [54, 11, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 32, 1],
                match: [','],
                idx: 9,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [1, 33, 1],
                match: ['$'],
                idx: 10,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [1, 45, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 15,
                    pos: [1, 35, 10],
                    match: ['; commment'],
                    idx: 0,
                    scope: [54, 11, 31],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 28,
                pos: [2, 2, 3],
                match: ['KW2'],
                idx: 11,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 6, 1],
                match: ['='],
                idx: 12,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [2, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [2, 8, 3],
                    match: ['kw2'],
                    idx: 0,
                    scope: [54, 11, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [2, 11, 1],
                match: [','],
                idx: 13,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [2, 13, 3],
                match: ['KW3'],
                idx: 14,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 17, 1],
                match: ['='],
                idx: 15,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [2, 22, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [2, 19, 3],
                    match: ['kw3'],
                    idx: 0,
                    scope: [54, 11, 3],
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

  it(`[auto generated] Convert variables to keywords when calling procedure methods`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `obj.method, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
      `  KW2 = kw2, KW3 = kw3`,
      ``,
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
        end: { match: ['end'], pos: [4, 0, 3] },
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
            pos: [1, 0, 3],
            match: ['obj'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 12,
            pos: [1, 3, 7],
            match: ['.method', '.', 'method'],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 22, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [1, 10, 1],
                match: [','],
                idx: 0,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 12, 4],
                match: ['arg1'],
                idx: 1,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 16, 1],
                match: [','],
                idx: 2,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 18, 4],
                match: ['arg2'],
                idx: 3,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 22, 1],
                match: [','],
                idx: 4,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 24, 4],
                match: ['arg3'],
                idx: 5,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 28, 1],
                match: [','],
                idx: 6,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [1, 30, 3],
                match: ['KW1'],
                idx: 7,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 33, 1],
                match: ['='],
                idx: 8,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [1, 37, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 34, 3],
                    match: ['kw1'],
                    idx: 0,
                    scope: [54, 12, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 37, 1],
                match: [','],
                idx: 9,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [1, 38, 1],
                match: ['$'],
                idx: 10,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [1, 50, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 15,
                    pos: [1, 40, 10],
                    match: ['; commment'],
                    idx: 0,
                    scope: [54, 12, 31],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 28,
                pos: [2, 2, 3],
                match: ['KW2'],
                idx: 11,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 6, 1],
                match: ['='],
                idx: 12,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [2, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [2, 8, 3],
                    match: ['kw2'],
                    idx: 0,
                    scope: [54, 12, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [2, 11, 1],
                match: [','],
                idx: 13,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [2, 13, 3],
                match: ['KW3'],
                idx: 14,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 17, 1],
                match: ['='],
                idx: 15,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [2, 22, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [2, 19, 3],
                    match: ['kw3'],
                    idx: 0,
                    scope: [54, 12, 3],
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

  it(`[auto generated] Convert variables to keywords when calling functions`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `res = mypro(arg1, arg2, arg3, KW1=kw1,$ ; commment`,
      `  KW2 = kw2, KW3 = kw3)`,
      ``,
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
        end: { match: ['end'], pos: [4, 0, 3] },
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
            pos: [1, 0, 3],
            match: ['res'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 4, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 23, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [1, 6, 6],
                match: ['mypro(', 'mypro'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [2, 22, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 12, 4],
                    match: ['arg1'],
                    idx: 0,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 16, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 18, 4],
                    match: ['arg2'],
                    idx: 2,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 22, 1],
                    match: [','],
                    idx: 3,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 24, 4],
                    match: ['arg3'],
                    idx: 4,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 28, 1],
                    match: [','],
                    idx: 5,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [1, 30, 3],
                    match: ['KW1'],
                    idx: 6,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [1, 33, 1],
                    match: ['='],
                    idx: 7,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [1, 37, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [1, 34, 3],
                        match: ['kw1'],
                        idx: 0,
                        scope: [54, 3, 8, 3],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 37, 1],
                    match: [','],
                    idx: 8,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 31,
                    pos: [1, 38, 1],
                    match: ['$'],
                    idx: 9,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [1, 50, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 15,
                        pos: [1, 40, 10],
                        match: ['; commment'],
                        idx: 0,
                        scope: [54, 3, 8, 31],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [2, 2, 3],
                    match: ['KW2'],
                    idx: 10,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [2, 6, 1],
                    match: ['='],
                    idx: 11,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [2, 11, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [2, 8, 3],
                        match: ['kw2'],
                        idx: 0,
                        scope: [54, 3, 8, 3],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [2, 11, 1],
                    match: [','],
                    idx: 12,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [2, 13, 3],
                    match: ['KW3'],
                    idx: 13,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [2, 17, 1],
                    match: ['='],
                    idx: 14,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [2, 22, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [2, 19, 3],
                        match: ['kw3'],
                        idx: 0,
                        scope: [54, 3, 8, 3],
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

  it(`[auto generated] Convert variables to keywords when calling function methods`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `res = obj.method(arg1, arg2, arg3, KW1=kw1,$ ; commment`,
      `  KW2 = kw2, KW3 = kw3)`,
      ``,
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
        end: { match: ['end'], pos: [4, 0, 3] },
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
            pos: [1, 0, 3],
            match: ['res'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 4, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 23, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [1, 6, 3],
                match: ['obj'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 9,
                pos: [1, 9, 8],
                match: ['.method(', '.', 'method', '('],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [2, 22, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 17, 4],
                    match: ['arg1'],
                    idx: 0,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 21, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 23, 4],
                    match: ['arg2'],
                    idx: 2,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 27, 1],
                    match: [','],
                    idx: 3,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 29, 4],
                    match: ['arg3'],
                    idx: 4,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 33, 1],
                    match: [','],
                    idx: 5,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [1, 35, 3],
                    match: ['KW1'],
                    idx: 6,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [1, 38, 1],
                    match: ['='],
                    idx: 7,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [1, 42, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [1, 39, 3],
                        match: ['kw1'],
                        idx: 0,
                        scope: [54, 3, 9, 3],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 42, 1],
                    match: [','],
                    idx: 8,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 31,
                    pos: [1, 43, 1],
                    match: ['$'],
                    idx: 9,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [1, 55, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 15,
                        pos: [1, 45, 10],
                        match: ['; commment'],
                        idx: 0,
                        scope: [54, 3, 9, 31],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [2, 2, 3],
                    match: ['KW2'],
                    idx: 10,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [2, 6, 1],
                    match: ['='],
                    idx: 11,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [2, 11, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [2, 8, 3],
                        match: ['kw2'],
                        idx: 0,
                        scope: [54, 3, 9, 3],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [2, 11, 1],
                    match: [','],
                    idx: 12,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [2, 13, 3],
                    match: ['KW3'],
                    idx: 13,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [2, 17, 1],
                    match: ['='],
                    idx: 14,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [2, 22, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [2, 19, 3],
                        match: ['kw3'],
                        idx: 0,
                        scope: [54, 3, 9, 3],
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
