import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
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
      0,
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
      { label: '!theme', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!version',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: "ENVITask('DeepLearningPixelClassification')",
        insertText: "ENVITask('DeepLearningPixelClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolylineShapefile')",
        insertText: "ENVITask('ClassActivationToPolylineShapefile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIBoundingBoxSet()',
        insertText: 'ENVIBoundingBoxSet()',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: "ENVITask('ConfigureOnnxModel')",
        insertText: "ENVITask('ConfigureOnnxModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainDeepLearningGridModel')",
        insertText: "ENVITask('TrainDeepLearningGridModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
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
  });

  it(`[auto generated] fake`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 56, character: 29 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'auxiliary_spatialref = ',
        insertText: 'auxiliary_spatialref = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'auxiliary_uri = ',
        insertText: 'auxiliary_uri = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'colormap = ',
        insertText: 'colormap = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword as a placeholder for a color table that will be used when you display a single band from a raster. The color table is a two-dimensional byte array of 3 x _n_Colors, where _n_Colors is typically 256\\. The default color table scale ramp is from 0 to 255\\. See [ENVIColorMap](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIColorMap.htm%22%7D) for details.\n\nThe color table is not applicable when displaying an RGB three-band image or a classification image. ',
        },
      },
      {
        label: 'coord_sys = ',
        insertText: 'coord_sys = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'data_ignore_value = ',
        insertText: 'data_ignore_value = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a pixel value that will be ignored when the raster is displayed. This overrides any data ignore values set in the metadata.',
        },
      },
      {
        label: 'data_type = ',
        insertText: 'data_type = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'error = ',
        insertText: 'error = ',
        kind: 20,
        sortText: '10',
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
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to an ENVIRaster from which all metadata and the following properties will be copied: DATA\\_TYPE, INTERLEAVE, NBANDS, NCOLUMNS, and NROWS. \n\nData acquisition time (from the ENVIRaster TIME property) will not be copied.\n\nSince new rasters are often created as the output of processing an input raster, they typically have the same spatial and spectral dimensions, interleave, and data type as the input raster. The INHERITS\\_FROM keyword provides convenience in inheriting these properties. \n\nIf you do not specify the INHERITS\\_FROM keyword, you must either provide the _Data_ argument and INTERLEAVE is assumed to be 'bsq' if not set, or specify the NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties.\n\nThe NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties have precedence over the values in the INHERITS\\_FROM raster.\n\nSee [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) for details on creating and modifying metadata.\n\n_Note:_ If both the SPATIALREF and INHERITS\\_FROM keywords are specified, the spatial reference information from SPATIALREF takes precedence.",
        },
      },
      {
        label: 'interleave = ',
        insertText: 'interleave = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'metadata = ',
        insertText: 'metadata = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'nbands = ',
        insertText: 'nbands = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'ncolumns = ',
        insertText: 'ncolumns = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'nrows = ',
        insertText: 'nrows = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'pyramid_exists = ',
        insertText: '/pyramid_exists',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'read_only = ',
        insertText: '/read_only',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'spatialref = ',
        insertText: 'spatialref = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'time = ',
        insertText: 'time = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'uri = ',
        insertText: 'uri = ',
        kind: 20,
        sortText: '10',
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
  });
});
