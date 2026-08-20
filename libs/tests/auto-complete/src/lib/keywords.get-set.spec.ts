import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for`, () => {
  it(`[auto generated] keywords in get/set`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/auto-complete/get_set_methods.pro',
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 4, character: 36 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'attribute_info = ',
        insertText: 'attribute_info = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An array of IDL_SHAPE_ATTRIBUTE structures containing the attribute information for each attribute. Each structure has NAME (string), TYPE (IDL type code), WIDTH (width in characters), and PRECISION (precision for Double) fields.',
        },
      },
      {
        label: 'attribute_names = ',
        insertText: 'attribute_names = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'A string array containing the names of each attribute.',
        },
      },
      {
        label: 'attribute_types = ',
        insertText: 'attribute_types = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An integer array containing the Shapefile types of each attribute. Possible values are: 0 (String), 1 (Integer number), 2 (Double-precision number), 3 (Logical), 4 (Date).',
        },
      },
      {
        label: 'dbf_only = ',
        insertText: 'dbf_only = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A non-zero, positive integer value indicating whether the underlying dBASE table (.`dbf`) component of the shapefile is opened while all other entity related files are left closed. The following two values are accepted for this property:\n\n* 1 - Open an existing .`dbf` file,\n* Greater than 1 - Create a new .`dbf` file\n\n_Note:_ The UPDATE keyword is required to open the .`dbf` file for updating.',
        },
      },
      {
        label: 'filename = ',
        insertText: 'filename = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string representing the fully qualified path name of the Shapefile in the current Shapefile object. Can only be set via the Filename argument to IDLffShape.',
        },
      },
      {
        label: 'is_open = ',
        insertText: 'is_open = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value representing the status of the Shapefile: 0 (not open), 1 (open read-only), 3 (open in update mode).',
        },
      },
      {
        label: 'n_attributes = ',
        insertText: 'n_attributes = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A longword integer representing the number of attributes associated with the Shapefile object. Returns 0 if unknown.',
        },
      },
      {
        label: 'n_entities = ',
        insertText: 'n_entities = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A longword integer representing the number of entities contained in the Shapefile object. Returns 0 if unknown.',
        },
      },
      {
        label: 'n_records = ',
        insertText: 'n_records = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A longword integer representing the number of records in the dBASE table (.dbf) component of the Shapefile.',
        },
      },
      {
        label: 'update = ',
        insertText: '/update',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value indicating whether the file is open for writing. True if opened with write permissions.',
        },
      },
      {
        label: 'shp',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'type',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'ent',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0,
        )
      ).slice(0, 50),
    );
    // define position
    const position_1: Position = { line: 5, character: 35 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'attribute_info = ',
        insertText: 'attribute_info = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An array of IDL_SHAPE_ATTRIBUTE structures containing the attribute information for each attribute. Each structure has NAME (string), TYPE (IDL type code), WIDTH (width in characters), and PRECISION (precision for Double) fields.',
        },
      },
      {
        label: 'attribute_names = ',
        insertText: 'attribute_names = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'A string array containing the names of each attribute.',
        },
      },
      {
        label: 'attribute_types = ',
        insertText: 'attribute_types = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An integer array containing the Shapefile types of each attribute. Possible values are: 0 (String), 1 (Integer number), 2 (Double-precision number), 3 (Logical), 4 (Date).',
        },
      },
      {
        label: 'dbf_only = ',
        insertText: 'dbf_only = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A non-zero, positive integer value indicating whether the underlying dBASE table (.`dbf`) component of the shapefile is opened while all other entity related files are left closed. The following two values are accepted for this property:\n\n* 1 - Open an existing .`dbf` file,\n* Greater than 1 - Create a new .`dbf` file\n\n_Note:_ The UPDATE keyword is required to open the .`dbf` file for updating.',
        },
      },
      {
        label: 'filename = ',
        insertText: 'filename = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string representing the fully qualified path name of the Shapefile in the current Shapefile object. Can only be set via the Filename argument to IDLffShape.',
        },
      },
      {
        label: 'is_open = ',
        insertText: 'is_open = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value representing the status of the Shapefile: 0 (not open), 1 (open read-only), 3 (open in update mode).',
        },
      },
      {
        label: 'n_attributes = ',
        insertText: 'n_attributes = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A longword integer representing the number of attributes associated with the Shapefile object. Returns 0 if unknown.',
        },
      },
      {
        label: 'n_entities = ',
        insertText: 'n_entities = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A longword integer representing the number of entities contained in the Shapefile object. Returns 0 if unknown.',
        },
      },
      {
        label: 'n_records = ',
        insertText: 'n_records = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A longword integer representing the number of records in the dBASE table (.dbf) component of the Shapefile.',
        },
      },
      {
        label: 'update = ',
        insertText: '/update',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value indicating whether the file is open for writing. True if opened with write permissions.',
        },
      },
      {
        label: 'shp',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'type',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'ent',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1,
        )
      ).slice(0, 50),
    );
  });
});
