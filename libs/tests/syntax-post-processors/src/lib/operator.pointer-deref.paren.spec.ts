import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] as first statement in paren`, () => {
    // test code to extract tokens from
    const code = [`a = (*var)`];

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
            end: { pos: [0, 10, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 64,
                pos: [0, 4, 1],
                match: ['('],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 9, 1], match: [')'] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 5, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 64],
                    parseProblems: [],
                    end: { pos: [0, 9, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 6, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 3, 64, 63],
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
