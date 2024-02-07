import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly identify variables instead of function calls`, () => {
  it(`[auto generated] for simple case`, () => {
    // test code to extract tokens from
    const code = [`;+ my var`, `a = 5`, ``, `!null = a()`, ``, `end`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 9],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [38],
        end: { match: ['end'], pos: [5, 0, 3] },
        kids: [
          {
            type: 0,
            name: 16,
            pos: [0, 0, 9],
            match: [';+ my var'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [0, 0, 9] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [0, 0, 9],
                match: [';+ my var'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [1, 0, 1],
            match: ['a'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 2, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [1, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 82,
            pos: [3, 0, 5],
            match: ['!null'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [3, 6, 1],
            match: ['='],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [3, 11, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                parseProblems: [],
                match: ['a'],
                pos: [3, 8, 1],
                scope: [54, 3],
                idx: 0,
              },
              {
                type: 0,
                name: 7,
                pos: [3, 9, 1],
                match: ['('],
                idx: 0,
                scope: [54, 3],
                parseProblems: [105],
                end: { pos: [3, 10, 1], match: [')'] },
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 9],
        end: [0, 0, 9],
        canReport: true,
      },
      {
        code: 105,
        info: 'Illegal use of parentheses for indexing variable, use brackets instead (function name matches local variable). If this is a function call, add `compile_opt idl2` to delineate between the variable and function call.',
        start: [3, 9, 1],
        end: [3, 10, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] do no change when compile opt strictarr`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt strictarr`,
      `a = 5`,
      ``,
      `!null = a()`,
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
            parseProblems: [42, 39],
            end: { pos: [0, 21, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 9],
                match: ['strictarr'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [1, 0, 1],
            match: ['a'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 2, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [1, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 82,
            pos: [3, 0, 5],
            match: ['!null'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [3, 6, 1],
            match: ['='],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [3, 11, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [3, 8, 2],
                match: ['a(', 'a'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [3, 10, 1], match: [')'] },
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 42,
        info: 'Use the "idl2" compile option instead. It is shorthand for "compile_opt defint32, strictarr".',
        start: [0, 12, 9],
        end: [0, 12, 9],
        canReport: true,
      },
      {
        code: 39,
        info: '"idl2" was not found as a compile option and should always be one',
        start: [0, 0, 11],
        end: [0, 21, 0],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] do no change when compile opt idl2`, () => {
    // test code to extract tokens from
    const code = [`compile_opt idl2`, `a = 5`, ``, `!null = a()`, ``, `end`];

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
            pos: [1, 0, 1],
            match: ['a'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 2, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [1, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 82,
            pos: [3, 0, 5],
            match: ['!null'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [3, 6, 1],
            match: ['='],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [3, 11, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [3, 8, 2],
                match: ['a(', 'a'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [3, 10, 1], match: [')'] },
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

  it(`[auto generated] do no change when compile opt idl3`, () => {
    // test code to extract tokens from
    const code = [`compile_opt idl3`, `a = 5`, ``, `!null = a()`, ``, `end`];

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
                match: ['idl3'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [1, 0, 1],
            match: ['a'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 2, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [1, 4, 1],
                match: ['5'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 82,
            pos: [3, 0, 5],
            match: ['!null'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [3, 6, 1],
            match: ['='],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [3, 11, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [3, 8, 2],
                match: ['a(', 'a'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [3, 10, 1], match: [')'] },
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
