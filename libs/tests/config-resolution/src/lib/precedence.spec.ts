import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Prefer idlformat.json over legacy idl.json`, () => {
  it(`[auto generated] when the legacy file is indexed first`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // specify filepath
    const filepath_0 = GetExtensionPath(
      'apps/test/idl/configs/subdir5/idl.json',
    );

    // add file to index
    await index.indexFile(filepath_0);

    // specify filepath
    const filepath_1 = GetExtensionPath(
      'apps/test/idl/configs/subdir5/idlformat.json',
    );

    // add file to index
    await index.indexFile(filepath_1);

    // specify filepath
    const filepath_2 = GetExtensionPath(
      'apps/test/idl/configs/subdir5/idl.pro',
    );

    // verify results
    expect({
      formatter: 'fiddle',
      hangingIndent: false,
      tabWidth: 2,
      maxIndent: 30,
      eol: 'lf',
      style: {
        quotes: 'single',
        methods: 'dot',
        keywords: 'upper',
        properties: 'camel',
        control: 'lower',
        numbers: 'lower',
        hex: 'lower',
        octal: 'lower',
        binary: 'lower',
        routines: 'match',
        routineMethods: 'camel',
        systemVariables: 'lower',
        localVariables: 'match',
        structureNames: 'pascal',
      },
      autoFix: true,
      autoDoc: false,
      styleAndFormat: true,
      spaceOffset: 0,
      trailingSpace: true,
    }).toEqual(index.getConfigForFile(filepath_2));
  });

  it(`[auto generated] when the legacy file is indexed last`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // specify filepath
    const filepath_0 = GetExtensionPath(
      'apps/test/idl/configs/subdir5/idlformat.json',
    );

    // add file to index
    await index.indexFile(filepath_0);

    // specify filepath
    const filepath_1 = GetExtensionPath(
      'apps/test/idl/configs/subdir5/idl.json',
    );

    // add file to index
    await index.indexFile(filepath_1);

    // specify filepath
    const filepath_2 = GetExtensionPath(
      'apps/test/idl/configs/subdir5/idl.pro',
    );

    // verify results
    expect({
      formatter: 'fiddle',
      hangingIndent: false,
      tabWidth: 2,
      maxIndent: 30,
      eol: 'lf',
      style: {
        quotes: 'single',
        methods: 'dot',
        keywords: 'upper',
        properties: 'camel',
        control: 'lower',
        numbers: 'lower',
        hex: 'lower',
        octal: 'lower',
        binary: 'lower',
        routines: 'match',
        routineMethods: 'camel',
        systemVariables: 'lower',
        localVariables: 'match',
        structureNames: 'pascal',
      },
      autoFix: true,
      autoDoc: false,
      styleAndFormat: true,
      spaceOffset: 0,
      trailingSpace: true,
    }).toEqual(index.getConfigForFile(filepath_2));
  });
});
