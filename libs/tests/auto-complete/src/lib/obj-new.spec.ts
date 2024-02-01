import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly return auto-complete from obj-new`, () => {
  it(`[auto generated] real`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 53, character: 26 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
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
      {
        label: '!package_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!path', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!prompt', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!quiet', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!version',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: "ENVITask('InitializeENVINet5MultiModel')",
        insertText: "ENVITask('InitializeENVINet5MultiModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        insertText: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBoundingBoxSet()',
        insertText: 'ENVIBoundingBoxSet()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowGridModel()',
        insertText: 'ENVITensorFlowGridModel()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowModel()',
        insertText: 'ENVITensorFlowModel()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: "ENVITask('BuildDeepLearningRaster')",
        insertText: "ENVITask('BuildDeepLearningRaster')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
  });

  it(`[auto generated] fake`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 56, character: 29 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'data_ignore_value = ',
        insertText: 'data_ignore_value = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a pixel value that will be ignored when the raster is displayed. This overrides any data ignore values set in the metadata.',
        },
      },
      {
        label: 'error = ',
        insertText: 'error = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (`''`). If an error occurs and the routine is a function, then the function result will be undefined.\n\nWhen this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR\\_STATE and CATCH.\n\nSee [Manage Errors](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ErrorHandling.htm%22%7D) for more information on error handling in ENVI programming.",
        },
      },
      {
        label: 'inherits_from = ',
        insertText: 'inherits_from = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to an ENVIRaster from which all metadata and the following properties will be copied: DATA\\_TYPE, INTERLEAVE, NBANDS, NCOLUMNS, and NROWS. \n\nData acquisition time (from the ENVIRaster TIME property) will not be copied.\n\nSince new rasters are often created as the output of processing an input raster, they typically have the same spatial and spectral dimensions, interleave, and data type as the input raster. The INHERITS\\_FROM keyword provides convenience in inheriting these properties. \n\nIf you do not specify the INHERITS\\_FROM keyword, you must either provide the _Data_ argument and INTERLEAVE is assumed to be 'bsq' if not set, or specify the NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties.\n\nThe NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties have precedence over the values in the INHERITS\\_FROM raster.\n\nSee [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) for details on creating and modifying metadata.\n\n_Note:_ If both the SPATIALREF and INHERITS\\_FROM keywords are specified, the spatial reference information from SPATIALREF takes precedence.",
        },
      },
      {
        label: 'data_type = ',
        insertText: 'data_type = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'An integer or string specifying the raster data type (strings are not case-sensitive). When retrieving the property, a string is returned.\n\n| String | Value | Data Type                                 |\n| ------ | ----- | ----------------------------------------- |\n| byte   | 1     | Byte (8 bits)                             |\n| double | 5     | Double-precision floating point (64 bits) |\n| float  | 4     | Floating point (32 bits)                  |\n| int    | 2     | Integer (16 bits)                         |\n| long   | 3     | Long integer (32 bits)                    |\n| uint   | 12    | Unsigned integer (16 bits)                |\n| ulong  | 13    | Unsigned long integer (32 bits)           |\n\nYou cannot create or modify an ENVIRaster that contains complex data.',
        },
      },
      {
        label: 'interleave = ',
        insertText: 'interleave = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string specifying the interleave of the raster.\n\n| String | Interleave                | Data Array                        |\n| ------ | ------------------------- | --------------------------------- |\n| bil    | Band interleaved by line  | \\[_ncolumns_, _nbands_, _nrows_\\] |\n| bip    | Band interleaved by pixel | \\[_nbands_, _ncolumns_, _nrows_\\] |\n| bsq    | Band sequential           | \\[_ncolumns_, _nrows_, _nbands_\\] |',
        },
      },
      {
        label: 'metadata = ',
        insertText: 'metadata = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) object. If METADATA and INHERITS\\_FROM are both set, the new raster will have the union of both sets of metadata. The METADATA values override those from INHERITS\\_FROM if there is a conflict.',
        },
      },
      {
        label: 'nbands = ',
        insertText: 'nbands = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'The number of bands in the raster.',
        },
      },
      {
        label: 'ncolumns = ',
        insertText: 'ncolumns = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'The number of columns in the raster.',
        },
      },
      {
        label: 'nrows = ',
        insertText: 'nrows = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'The number of rows in the raster.',
        },
      },
      {
        label: 'spatialref = ',
        insertText: 'spatialref = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to an [ENVIGLTRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIGLTRasterSpatialRef/ENVIGLTRasterSpatialRef.htm%22%7D), [ENVIPseudoRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIPseudoRasterSpatialRef/ENVIPseudoRasterSpatialRef.htm%22%7D), [ENVIRPCRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRPCRasterSpatialRef/ENVIRPCRasterSpatialRef.htm%22%7D), or [ENVIStandardRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIStandardRasterSpatialRef/ENVIStandardRasterSpatialRef.htm%22%7D) object.',
        },
      },
      {
        label: 'time = ',
        insertText: 'time = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVITime](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVITime/ENVITime.htm%22%7D) object.',
        },
      },
      {
        label: 'uri = ',
        insertText: 'uri = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string that is a fully qualified raster file path. If not set on initialization, a temporary file will be generated.',
        },
      },
      {
        label: 'auxiliary_spatialref = ',
        insertText: 'auxiliary_spatialref = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'auxiliary_uri = ',
        insertText: 'auxiliary_uri = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'coord_sys = ',
        insertText: 'coord_sys = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'pyramid_exists = ',
        insertText: '/pyramid_exists',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'read_only = ',
        insertText: '/read_only',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
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
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
  });
});
