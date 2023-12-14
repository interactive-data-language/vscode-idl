import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly map options for compound control statements`, () => {
  it(`[auto generated] Convert variables to control options`, () => {
    // test code to extract tokens from
    const code = [
      `pro mypro`,
      `  compile_opt idl2`,
      `  common blockName ; ignore for now`,
      `  forward_function myfunc1, myfunc2, myfunc3`,
      `  goto, stmnt`,
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
        end: { pos: [6, 0, 3], match: ['end'] },
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
            pos: [1, 2, 11],
            match: ['compile_opt'],
            idx: 1,
            scope: [72],
            parseProblems: [],
            end: { pos: [1, 18, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [1, 14, 4],
                match: ['idl2'],
                idx: 0,
                scope: [72, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 19,
            pos: [2, 2, 6],
            match: ['common'],
            idx: 2,
            scope: [72],
            parseProblems: [],
            end: { pos: [2, 19, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [2, 9, 9],
                match: ['blockName'],
                idx: 0,
                scope: [72, 19],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 15,
            pos: [2, 19, 16],
            match: ['; ignore for now'],
            idx: 3,
            scope: [72],
            parseProblems: [],
          },
          {
            type: 0,
            name: 22,
            pos: [3, 2, 16],
            match: ['forward_function'],
            idx: 4,
            scope: [72],
            parseProblems: [],
            end: { pos: [3, 44, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [3, 19, 7],
                match: ['myfunc1'],
                idx: 0,
                scope: [72, 22],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [3, 26, 1],
                match: [','],
                idx: 1,
                scope: [72, 22],
                parseProblems: [],
              },
              {
                type: 1,
                name: 25,
                pos: [3, 28, 7],
                match: ['myfunc2'],
                idx: 2,
                scope: [72, 22],
                parseProblems: [],
              },
              {
                type: 1,
                name: 14,
                pos: [3, 35, 1],
                match: [','],
                idx: 3,
                scope: [72, 22],
                parseProblems: [],
              },
              {
                type: 1,
                name: 25,
                pos: [3, 37, 7],
                match: ['myfunc3'],
                idx: 4,
                scope: [72, 22],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 23,
            pos: [4, 2, 4],
            match: ['goto'],
            idx: 5,
            scope: [72],
            parseProblems: [],
            end: { pos: [4, 13, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 14,
                pos: [4, 6, 1],
                match: [','],
                idx: 0,
                scope: [72, 23],
                parseProblems: [],
              },
              {
                type: 1,
                name: 25,
                pos: [4, 8, 5],
                match: ['stmnt'],
                idx: 1,
                scope: [72, 23],
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
