import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly map arrows`, () => {
  it(`[auto generated] as procedure-method, but incomplete`, () => {
    // test code to extract tokens from
    const code = [`compile_opt idl2`, `a->`, `end`];

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
        end: { match: ['end'], pos: [2, 0, 3] },
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
            type: 1,
            name: 2,
            pos: [1, 1, 2],
            match: ['->'],
            idx: 2,
            scope: [54],
            parseProblems: [8],
          },
        ],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 8,
        info: 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
        start: [1, 1, 2],
        end: [1, 1, 2],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] as function method, but incomplete`, () => {
    // test code to extract tokens from
    const code = [`compile_opt idl2`, `a = b->`, `end`];

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
        end: { match: ['end'], pos: [2, 0, 3] },
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
            end: { pos: [1, 7, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 85,
                pos: [1, 4, 1],
                match: ['b'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
              {
                type: 1,
                name: 2,
                pos: [1, 5, 2],
                match: ['->'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [8],
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
        code: 8,
        info: 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
        start: [1, 5, 2],
        end: [1, 5, 2],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
