import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { SanitizeAllProblems } from '@idl/tests/helpers';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly identify duplicate problems`, () => {
  it(`[auto generated] while adding and removing files`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath_0 = GetExtensionPath('idl/test/global-problems/file1.pro');

    // add file to index
    await index.indexFile(filepath_0);

    // define expected problems
    const problems_0: { [key: string]: SyntaxProblems } = {};

    // verify results
    expect(problems_0).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems'
      )
    );

    // specify filepath
    const filepath_1 = GetExtensionPath('idl/test/global-problems/file2.pro');

    // add file to index
    await index.indexFile(filepath_1);

    // define expected problems
    const problems_1: { [key: string]: SyntaxProblems } = {
      'idl/test/global-problems/file1.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
      ],
      'idl/test/global-problems/file2.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
      ],
    };

    // verify results
    expect(problems_1).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems'
      )
    );

    // specify filepath
    const filepath_2 = GetExtensionPath('idl/test/global-problems/file3.pro');

    // add file to index
    await index.indexFile(filepath_2);

    // define expected problems
    const problems_2: { [key: string]: SyntaxProblems } = {
      'idl/test/global-problems/file1.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file1.pro',
        },
      ],
      'idl/test/global-problems/file2.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
      ],
      'idl/test/global-problems/file3.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
      ],
    };

    // verify results
    expect(problems_2).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems'
      )
    );

    // specify filepath
    const filepath_3 = GetExtensionPath('idl/test/global-problems/file1.pro');

    // remove file from index
    index.removeFile(filepath_3);

    // define expected problems
    const problems_3: { [key: string]: SyntaxProblems } = {
      'idl/test/global-problems/file1.pro': [],
      'idl/test/global-problems/file2.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file2.pro',
        },
      ],
      'idl/test/global-problems/file3.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/file3.pro',
        },
      ],
    };

    // verify results
    expect(problems_3).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems'
      )
    );

    // specify filepath
    const filepath_4 = GetExtensionPath('idl/test/global-problems/file2.pro');

    // remove file from index
    index.removeFile(filepath_4);

    // define expected problems
    const problems_4: { [key: string]: SyntaxProblems } = {
      'idl/test/global-problems/file1.pro': [],
      'idl/test/global-problems/file2.pro': [],
      'idl/test/global-problems/file3.pro': [],
    };

    // verify results
    expect(problems_4).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems'
      )
    );
  });
});
