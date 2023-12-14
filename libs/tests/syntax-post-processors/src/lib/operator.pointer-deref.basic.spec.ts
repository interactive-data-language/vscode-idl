import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] ignore multiplication`, () => {
    // test code to extract tokens from
    const code = [`a = 6 * 7`];

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
            end: { pos: [0, 9, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [0, 4, 1],
                match: ['6'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 57,
                pos: [0, 6, 1],
                match: ['*'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 9, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [0, 8, 1],
                    match: ['7'],
                    idx: 0,
                    scope: [54, 3, 57],
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

  it(`[auto generated] ignore multiplication`, () => {
    // test code to extract tokens from
    const code = [`a = (6) * (7)`];

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
            end: { pos: [0, 13, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 64,
                pos: [0, 4, 1],
                match: ['('],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 6, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [0, 5, 1],
                    match: ['6'],
                    idx: 0,
                    scope: [54, 3, 64],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 57,
                pos: [0, 8, 1],
                match: ['*'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 13, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 64,
                    pos: [0, 10, 1],
                    match: ['('],
                    idx: 0,
                    scope: [54, 3, 57],
                    parseProblems: [],
                    end: { pos: [0, 12, 1], match: [')'] },
                    kids: [
                      {
                        type: 1,
                        name: 56,
                        pos: [0, 11, 1],
                        match: ['7'],
                        idx: 0,
                        scope: [54, 3, 57, 64],
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

  it(`[auto generated] assignment`, () => {
    // test code to extract tokens from
    const code = [`a = *var`];

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
            end: { pos: [0, 8, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 63,
                pos: [0, 4, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 8, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 5, 3],
                    match: ['var'],
                    idx: 0,
                    scope: [54, 3, 63],
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

  it(`[auto generated] after operators`, () => {
    // test code to extract tokens from
    const code = [`a = 5 + *var`];

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
            end: { pos: [0, 12, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [0, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 57,
                pos: [0, 6, 1],
                match: ['+'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 12, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 8, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 57],
                    parseProblems: [],
                    end: { pos: [0, 12, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 9, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 3, 57, 63],
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

  it(`[auto generated] after mod operator`, () => {
    // test code to extract tokens from
    const code = [`a = mod *var`];

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
            end: { pos: [0, 12, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 57,
                pos: [0, 4, 3],
                match: ['mod'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 12, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 8, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 57],
                    parseProblems: [],
                    end: { pos: [0, 12, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 9, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 3, 57, 63],
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

  it(`[auto generated] after logical operators`, () => {
    // test code to extract tokens from
    const code = [`a = 5 le *var`];

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
            end: { pos: [0, 13, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [0, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 0,
                name: 61,
                pos: [0, 6, 2],
                match: ['le'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 13, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 9, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 61],
                    parseProblems: [],
                    end: { pos: [0, 13, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 10, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 3, 61, 63],
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

  it(`[auto generated] single line`, () => {
    // test code to extract tokens from
    const code = [`*ptr = 42`];

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
            type: 0,
            name: 63,
            pos: [0, 0, 1],
            match: ['*'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 9, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [0, 1, 3],
                match: ['ptr'],
                idx: 0,
                scope: [54, 63],
                parseProblems: [],
              },
              {
                type: 0,
                name: 3,
                pos: [0, 5, 1],
                match: ['='],
                idx: 1,
                scope: [54, 63],
                parseProblems: [],
                end: { pos: [0, 9, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 56,
                    pos: [0, 7, 2],
                    match: ['42'],
                    idx: 0,
                    scope: [54, 63, 3],
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
