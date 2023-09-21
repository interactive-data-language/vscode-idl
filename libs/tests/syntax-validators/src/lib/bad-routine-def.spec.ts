import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify that we can parse and report problems`, () => {
  it(`[auto generated] for bad function`, async () => {
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
    const code = [
      `function `,
      ``,
      `; pro test_myurl`,
      ``,
      `a = curl_easy_init()`,
      `curlopt_header = 42`,
      `print, 'curl_easy_setopt', curl_easy_setopt(a, curlopt_header, 1)`,
      `curlopt_url = 10002`,
      `print, 'curl_easy_setopt', curl_easy_setopt(a, curlopt_url, 'http://www.google.com')`,
      `print, 'curl_easy_perform', curl_easy_perform(a)`,
      `curl_easy_cleanup, a`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 43,
        info: 'Comma expected after statement',
        start: [4, 0, 1],
        end: [4, 0, 1],
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 9],
        end: [0, 0, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [6, 44, 1],
        end: [6, 44, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "curlopt_header"',
        start: [6, 47, 14],
        end: [6, 47, 14],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [8, 44, 1],
        end: [8, 44, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "curlopt_url"',
        start: [8, 47, 11],
        end: [8, 47, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [9, 46, 1],
        end: [9, 46, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [10, 19, 1],
        end: [10, 19, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] for bad pro`, async () => {
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
    const code = [
      `pro `,
      ``,
      `; pro test_myurl`,
      ``,
      `a = curl_easy_init()`,
      `curlopt_header = 42`,
      `print, 'curl_easy_setopt', curl_easy_setopt(a, curlopt_header, 1)`,
      `curlopt_url = 10002`,
      `print, 'curl_easy_setopt', curl_easy_setopt(a, curlopt_url, 'http://www.google.com')`,
      `print, 'curl_easy_perform', curl_easy_perform(a)`,
      `curl_easy_cleanup, a`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 43,
        info: 'Comma expected after statement',
        start: [4, 0, 1],
        end: [4, 0, 1],
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 4],
        end: [0, 0, 4],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [6, 44, 1],
        end: [6, 44, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "curlopt_header"',
        start: [6, 47, 14],
        end: [6, 47, 14],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [8, 44, 1],
        end: [8, 44, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "curlopt_url"',
        start: [8, 47, 11],
        end: [8, 47, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [9, 46, 1],
        end: [9, 46, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [10, 19, 1],
        end: [10, 19, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
