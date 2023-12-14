import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly extract argument definitions from code`, () => {
  it(`[auto generated] Convert variables to arguments in standard routine definitions`, () => {
    // test code to extract tokens from
    const code = [
      `pro mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
      `  KW2 = kw2, KW3 = kw3`,
      `  compile_opt idl2`,
      ``,
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
        end: { pos: [4, 0, 3], match: ['end'] },
        kids: [
          {
            type: 0,
            name: 71,
            pos: [0, 4, 5],
            match: ['mypro'],
            idx: 0,
            scope: [72],
            parseProblems: [],
            end: { pos: [1, 22, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [0, 9, 1],
                match: [','],
                idx: 0,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 1,
                pos: [0, 11, 4],
                match: ['arg1'],
                idx: 1,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 15, 1],
                match: [','],
                idx: 2,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 1,
                pos: [0, 17, 4],
                match: ['arg2'],
                idx: 3,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 21, 1],
                match: [','],
                idx: 4,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 1,
                pos: [0, 23, 4],
                match: ['arg3'],
                idx: 5,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 27, 1],
                match: [','],
                idx: 6,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 30,
                pos: [0, 29, 3],
                match: ['KW1'],
                idx: 7,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [0, 32, 1],
                match: ['='],
                idx: 8,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [0, 36, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 33, 3],
                    match: ['kw1'],
                    idx: 0,
                    scope: [72, 71, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 36, 1],
                match: [','],
                idx: 9,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [0, 37, 1],
                match: ['$'],
                idx: 10,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [0, 49, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 15,
                    pos: [0, 39, 10],
                    match: ['; commment'],
                    idx: 0,
                    scope: [72, 71, 31],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 30,
                pos: [1, 2, 3],
                match: ['KW2'],
                idx: 11,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 6, 1],
                match: ['='],
                idx: 12,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [1, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 8, 3],
                    match: ['kw2'],
                    idx: 0,
                    scope: [72, 71, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 11, 1],
                match: [','],
                idx: 13,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 30,
                pos: [1, 13, 3],
                match: ['KW3'],
                idx: 14,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 17, 1],
                match: ['='],
                idx: 15,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [1, 22, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 19, 3],
                    match: ['kw3'],
                    idx: 0,
                    scope: [72, 71, 3],
                    parseProblems: [],
                  },
                ],
              },
            ],
          },
          {
            type: 0,
            name: 20,
            pos: [2, 2, 11],
            match: ['compile_opt'],
            idx: 1,
            scope: [72],
            parseProblems: [],
            end: { pos: [2, 18, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [2, 14, 4],
                match: ['idl2'],
                idx: 0,
                scope: [72, 20],
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

  it(`[auto generated] Convert variables to arguments in routine method definition`, () => {
    // test code to extract tokens from
    const code = [
      `pro mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
      `  KW2 = kw2, KW3 = kw3`,
      `  compile_opt idl2`,
      ``,
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
        end: { pos: [4, 0, 3], match: ['end'] },
        kids: [
          {
            type: 0,
            name: 71,
            pos: [0, 4, 5],
            match: ['mypro'],
            idx: 0,
            scope: [72],
            parseProblems: [],
            end: { pos: [1, 22, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [0, 9, 1],
                match: [','],
                idx: 0,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 1,
                pos: [0, 11, 4],
                match: ['arg1'],
                idx: 1,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 15, 1],
                match: [','],
                idx: 2,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 1,
                pos: [0, 17, 4],
                match: ['arg2'],
                idx: 3,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 21, 1],
                match: [','],
                idx: 4,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 1,
                pos: [0, 23, 4],
                match: ['arg3'],
                idx: 5,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 27, 1],
                match: [','],
                idx: 6,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 30,
                pos: [0, 29, 3],
                match: ['KW1'],
                idx: 7,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [0, 32, 1],
                match: ['='],
                idx: 8,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [0, 36, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 33, 3],
                    match: ['kw1'],
                    idx: 0,
                    scope: [72, 71, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [0, 36, 1],
                match: [','],
                idx: 9,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [0, 37, 1],
                match: ['$'],
                idx: 10,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [0, 49, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 15,
                    pos: [0, 39, 10],
                    match: ['; commment'],
                    idx: 0,
                    scope: [72, 71, 31],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 30,
                pos: [1, 2, 3],
                match: ['KW2'],
                idx: 11,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 6, 1],
                match: ['='],
                idx: 12,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [1, 11, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 8, 3],
                    match: ['kw2'],
                    idx: 0,
                    scope: [72, 71, 3],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 11, 1],
                match: [','],
                idx: 13,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 1,
                name: 30,
                pos: [1, 13, 3],
                match: ['KW3'],
                idx: 14,
                scope: [72, 71],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 17, 1],
                match: ['='],
                idx: 15,
                scope: [72, 71],
                parseProblems: [],
                end: { pos: [1, 22, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 19, 3],
                    match: ['kw3'],
                    idx: 0,
                    scope: [72, 71, 3],
                    parseProblems: [],
                  },
                ],
              },
            ],
          },
          {
            type: 0,
            name: 20,
            pos: [2, 2, 11],
            match: ['compile_opt'],
            idx: 1,
            scope: [72],
            parseProblems: [],
            end: { pos: [2, 18, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [2, 14, 4],
                match: ['idl2'],
                idx: 0,
                scope: [72, 20],
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
