import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects unknown tokens`, () => {
  it(`[auto generated] with example in structure`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`a = {1+2}`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [0, 5, 3],
        end: [0, 5, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] after line continuation`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`compile_opt idl2`, `a = $ , $ ; ok`, `42`, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [1, 6, 4],
        end: [1, 6, 4],
      },
      {
        code: 35,
        info: 'Only comments are allowed after line continuations. This helps prevent accidental bugs.',
        start: [1, 4, 1],
        end: [1, 6, 4],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ternary without assignment`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`!true ? a : b`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 13,
        info: 'Unexpected conditional (ternary/elvis) operator',
        start: [0, 6, 2],
        end: [0, 6, 2],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] comma in assignment`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`a = ,`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 68,
        info: 'Expected IDL statement or expression after, but none was found',
        start: [0, 2, 1],
        end: [0, 4, 0],
      },
      { code: 9, info: 'Illegal comma', start: [0, 4, 1], end: [0, 4, 1] },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] quotes in structures 1`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`a = {'bad'}`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [0, 5, 5],
        end: [0, 5, 5],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] quotes in structures 2`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`a = {"bad"}`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [0, 5, 5],
        end: [0, 5, 5],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
