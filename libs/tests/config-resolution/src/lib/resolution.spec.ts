import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly identify parses and returns config files`, () => {
  it(`[auto generated] based on their folders`, async () => {
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
    const filepath_0 = GetExtensionPath('idl/test/configs/subdir1/idl.json');

    // add file to index
    await index.indexFile(filepath_0);

    // specify filepath
    const filepath_1 = GetExtensionPath('idl/test/configs/subdir2/idl.json');

    // add file to index
    await index.indexFile(filepath_1);

    // specify filepath
    const filepath_2 = GetExtensionPath('idl/test/configs/subdir3/idl.json');

    // add file to index
    await index.indexFile(filepath_2);

    // specify filepath
    const filepath_3 = GetExtensionPath('idl/test/configs/subdir1/idl.pro');

    // verify results
    expect({
      formatter: 'fiddle',
      tabWidth: 2,
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
    }).toEqual(index.getConfigForFile(filepath_3));

    // specify filepath
    const filepath_4 = GetExtensionPath('idl/test/configs/subdir2/idl.pro');

    // verify results
    expect({
      formatter: 'fiddle',
      tabWidth: 2,
      eol: 'lf',
      style: {
        quotes: 'single',
        methods: 'dot',
        keywords: 'lower',
        properties: 'camel',
        control: 'upper',
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
    }).toEqual(index.getConfigForFile(filepath_4));

    // specify filepath
    const filepath_5 = GetExtensionPath('idl/test/configs/subdir3/idl.pro');

    // verify results
    expect({
      formatter: 'fiddle',
      tabWidth: 2,
      eol: 'lf',
      style: {
        quotes: 'single',
        methods: 'dot',
        keywords: 'lower',
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
    }).toEqual(index.getConfigForFile(filepath_5));
  });
});
