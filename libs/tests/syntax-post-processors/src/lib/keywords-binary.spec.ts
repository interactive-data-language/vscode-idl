import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly detect binary keywords`, () => {
  it(`[auto generated] in procedure`, () => {
    // test code to extract tokens from
    const code = [`mypro, /kw1, /KW2`];

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
            end: { pos: [0, 17, 0], match: [''] },
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
                type: 1,
                name: 29,
                pos: [0, 7, 4],
                match: ['/kw1', 'kw1'],
                idx: 1,
                scope: [54, 11],
                parseProblems: [],
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
                type: 1,
                name: 29,
                pos: [0, 13, 4],
                match: ['/KW2', 'KW2'],
                idx: 3,
                scope: [54, 11],
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

  it(`[auto generated] in procedure method`, () => {
    // test code to extract tokens from
    const code = [`myclass.method, $`, `  /KW3, KW=!true`];

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
        parseProblems: [38, 33],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 7],
            match: ['myclass'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 12,
            pos: [0, 7, 7],
            match: ['.method', '.', 'method'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [0, 14, 1],
                match: [','],
                idx: 0,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [0, 16, 1],
                match: ['$'],
                idx: 1,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [0, 17, 0], match: [''] },
                kids: [],
              },
              {
                type: 1,
                name: 29,
                pos: [1, 2, 4],
                match: ['/KW3', 'KW3'],
                idx: 2,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 6, 1],
                match: [','],
                idx: 3,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 1,
                name: 28,
                pos: [1, 8, 2],
                match: ['KW'],
                idx: 4,
                scope: [54, 12],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [1, 10, 1],
                match: ['='],
                idx: 5,
                scope: [54, 12],
                parseProblems: [],
                end: { pos: [1, 16, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 82,
                    pos: [1, 11, 5],
                    match: ['!true'],
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 7],
        end: [0, 0, 7],
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [0, 0, 1.7976931348623157e308],
        end: [0, 0, 1.7976931348623157e308],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in function`, () => {
    // test code to extract tokens from
    const code = [`a = myfunc(/KW1, /KW2)`];

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
            end: { pos: [0, 22, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [0, 4, 7],
                match: ['myfunc(', 'myfunc'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 21, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 29,
                    pos: [0, 11, 4],
                    match: ['/KW1', 'KW1'],
                    idx: 0,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [0, 15, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 29,
                    pos: [0, 17, 4],
                    match: ['/KW2', 'KW2'],
                    idx: 2,
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

  it(`[auto generated] in function method`, () => {
    // test code to extract tokens from
    const code = [`ZACH = AWESOME.SAUCE(/kw3, $`, `/KW17, KW18 = !false)`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 4],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [38, 33],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 4],
            match: ['ZACH'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 5, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 21, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [0, 7, 7],
                match: ['AWESOME'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 9,
                pos: [0, 14, 7],
                match: ['.SAUCE(', '.', 'SAUCE', '('],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [1, 20, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 29,
                    pos: [0, 21, 4],
                    match: ['/kw3', 'kw3'],
                    idx: 0,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [0, 25, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 31,
                    pos: [0, 27, 1],
                    match: ['$'],
                    idx: 2,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [0, 28, 0], match: [''] },
                    kids: [],
                  },
                  {
                    type: 1,
                    name: 29,
                    pos: [1, 0, 5],
                    match: ['/KW17', 'KW17'],
                    idx: 3,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 5, 1],
                    match: [','],
                    idx: 4,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 28,
                    pos: [1, 7, 4],
                    match: ['KW18'],
                    idx: 5,
                    scope: [54, 3, 9],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 3,
                    pos: [1, 12, 1],
                    match: ['='],
                    idx: 6,
                    scope: [54, 3, 9],
                    parseProblems: [],
                    end: { pos: [1, 20, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 82,
                        pos: [1, 14, 6],
                        match: ['!false'],
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 4],
        end: [0, 0, 4],
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [0, 0, 1.7976931348623157e308],
        end: [0, 0, 1.7976931348623157e308],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] preserve other children after keyword`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `tvcrs,x,y,/dev $  ;Restore cursor`,
      `          kw=2`,
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
            match: ['tvcrs'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 14, 0], match: [''] },
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
                pos: [1, 6, 1],
                match: ['x'],
                idx: 1,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 7, 1],
                match: [','],
                idx: 2,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 85,
                pos: [1, 8, 1],
                match: ['y'],
                idx: 3,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [1, 9, 1],
                match: [','],
                idx: 4,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 1,
                name: 29,
                pos: [1, 10, 4],
                match: ['/dev', 'dev'],
                idx: 5,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 31,
                pos: [1, 15, 1],
                match: ['$'],
                idx: 6,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [1, 33, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 15,
                    pos: [1, 18, 15],
                    match: [';Restore cursor'],
                    idx: 0,
                    scope: [54, 11, 31],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 1,
                name: 85,
                pos: [2, 10, 2],
                match: ['kw'],
                idx: 7,
                scope: [54, 11],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [2, 12, 1],
                match: ['='],
                idx: 8,
                scope: [54, 11],
                parseProblems: [],
                end: { pos: [2, 14, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [2, 13, 1],
                    match: ['2'],
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

  it(`[auto generated] properly handle comments in function calls`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `wDatatable = WIDGET_TABLE(id_datarow, $`,
      `;        FORMAT='(A)', $`,
      `  /RESIZEABLE_COLUMNS)`,
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
            type: 1,
            name: 85,
            pos: [1, 0, 10],
            match: ['wDatatable'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 11, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [3, 22, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [1, 13, 13],
                match: ['WIDGET_TABLE(', 'WIDGET_TABLE'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [3, 21, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 26, 10],
                    match: ['id_datarow'],
                    idx: 0,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 14,
                    pos: [1, 36, 1],
                    match: [','],
                    idx: 1,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 31,
                    pos: [1, 38, 1],
                    match: ['$'],
                    idx: 2,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [1, 39, 0], match: [''] },
                    kids: [],
                  },
                  {
                    type: 1,
                    name: 15,
                    pos: [2, 0, 24],
                    match: [";        FORMAT='(A)', $"],
                    idx: 3,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 1,
                    name: 29,
                    pos: [3, 2, 19],
                    match: ['/RESIZEABLE_COLUMNS', 'RESIZEABLE_COLUMNS'],
                    idx: 4,
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
});
