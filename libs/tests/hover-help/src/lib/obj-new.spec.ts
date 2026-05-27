import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find find definition from obj new`, () => {
  it(`[auto generated] case 1`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 53, character: 12 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22myclass%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: myclass',
      ';-',
      'result = myclass()',
      '```',
      '',
      'Constructor',
      '',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0,
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim),
    );
  });

  it(`[auto generated] case 2`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 56, character: 12 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/enviRaster.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22ENVIRaster%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: ENVIRaster',
      ';-',
      'result = ENVIRaster(data, $',
      '  auxiliary_spatialref = value, $',
      '  auxiliary_uri = value, $',
      '  colormap = value, $',
      '  coord_sys = value, $',
      '  data_ignore_value = value, $',
      '  data_type = value, $',
      '  error = value, $',
      '  inherits_from = value, $',
      '  interleave = value, $',
      '  metadata = value, $',
      '  nbands = value, $',
      '  ncolumns = value, $',
      '  nrows = value, $',
      '  /pyramid_exists, $',
      '  /read_only, $',
      '  spatialref = value, $',
      '  time = value, $',
      '  uri = value)',
      '```',
      '',
      'This is a reference to a raster object.',
      '',
      '',
      '### Arguments',
      '',
      '- **data**: bidirectional, optional, any',
      '',
      '  A 2D or 3D array of data. When the _Data_ argument is a 3D array, use the INTERLEAVE keyword to specify the interleave of the raster.',
      '  ',
      "  If you specify the _Data_ argument, the values for the NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties are taken from the _Data_ raster object. INTERLEAVE is assumed to be 'bsq' if not set.",
      '  ',
      '  You cannot create or modify an ENVIRaster that contains complex data.',
      '  ',
      '  If you do not specify the _Data_ argument:',
      '  ',
      '  * An empty ENVIRaster object is created. You must specify (1) INHERITS\\_FROM or (2) NBANDS, NCOLUMNS, NROWS, **and** DATA\\_TYPE. You can then use [ENVIRaster::SetData](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/enviRaster%255F%255FSetData.htm%22%7D) or [ENVIRaster::SetTile](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/enviRaster%255F%255FSetTile.htm%22%7D) to add data to the ENVIRaster.',
      '  * The NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties have precedence over the values in the INHERITS\\_FROM raster, if you specify that raster.',
      '',
      '',
      '',
      '### Keywords',
      '',
      '- **auxiliary_spatialref**: in, optional, ENVIStandardRasterSpatialref | ENVIRPCRasterSpatialref | ENVIPseudoRasterSpatialref | ENVIGLTRasterSpatialRef',
      '',
      '    ',
      '',
      '- **auxiliary_uri**: in, optional, Array\\<String\\>',
      '',
      '    ',
      '',
      '- **colormap**: bidirectional, optional, any',
      '',
      '    Set this keyword as a placeholder for a color table that will be used when you display a single band from a raster. The color table is a two-dimensional byte array of 3 x _n_Colors, where _n_Colors is typically 256\\. The default color table scale ramp is from 0 to 255\\. See [ENVIColorMap](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIColorMap.htm%22%7D) for details.',
      '    ',
      '    The color table is not applicable when displaying an RGB three-band image or a classification image. ',
      '',
      '- **coord_sys**: in, optional, ENVICoordSys',
      '',
      '    ',
      '',
      '- **data_ignore_value**: bidirectional, optional, any',
      '',
      '    Set this keyword to a pixel value that will be ignored when the raster is displayed. This overrides any data ignore values set in the metadata.',
      '',
      '- **data_type**: in, optional, Number',
      '',
      '    ',
      '',
      '- **error**: out, optional, String',
      '',
      "    Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (`''`). If an error occurs and the routine is a function, then the function result will be undefined.",
      '    ',
      "    When this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR\\_STATE and CATCH.",
      '    ',
      '    See [Manage Errors](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ErrorHandling.htm%22%7D) for more information on error handling in ENVI programming.',
      '',
      '- **inherits_from**: bidirectional, optional, any',
      '',
      '    Set this keyword to an ENVIRaster from which all metadata and the following properties will be copied: DATA\\_TYPE, INTERLEAVE, NBANDS, NCOLUMNS, and NROWS. ',
      '    ',
      '    Data acquisition time (from the ENVIRaster TIME property) will not be copied.',
      '    ',
      '    Since new rasters are often created as the output of processing an input raster, they typically have the same spatial and spectral dimensions, interleave, and data type as the input raster. The INHERITS\\_FROM keyword provides convenience in inheriting these properties. ',
      '    ',
      "    If you do not specify the INHERITS\\_FROM keyword, you must either provide the _Data_ argument and INTERLEAVE is assumed to be 'bsq' if not set, or specify the NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties.",
      '    ',
      '    The NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties have precedence over the values in the INHERITS\\_FROM raster.',
      '    ',
      '    See [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) for details on creating and modifying metadata.',
      '    ',
      '    _Note:_ If both the SPATIALREF and INHERITS\\_FROM keywords are specified, the spatial reference information from SPATIALREF takes precedence.',
      '',
      '- **interleave**: in, optional, String',
      '',
      '    ',
      '',
      '- **metadata**: in, optional, ENVIRasterMetadata',
      '',
      '    ',
      '',
      '- **nbands**: in, optional, Number',
      '',
      '    ',
      '',
      '- **ncolumns**: in, optional, Number',
      '',
      '    ',
      '',
      '- **nrows**: in, optional, Number',
      '',
      '    ',
      '',
      '- **pyramid_exists**: out, optional, Boolean',
      '',
      '    ',
      '',
      '- **read_only**: out, optional, Boolean',
      '',
      '    ',
      '',
      '- **spatialref**: in, optional, ENVIStandardRasterSpatialref | ENVIRPCRasterSpatialref | ENVIPseudoRasterSpatialref | ENVIGLTRasterSpatialRef',
      '',
      '    ',
      '',
      '- **time**: in, optional, ENVITime',
      '',
      '    ',
      '',
      '- **uri**: in, optional, String',
      '',
      '    ',
      '',
      '',
      '',
      '### Example',
      '',
      'The following code opens a file which returns an ENVIRaster and then creates a new ENVIRaster with one band from the original raster.',
      '',
      '```idl',
      '  ; Start the application',
      '  e = envi()',
      '',
      '  ; Select input data',
      "  file = filepath('qb_boulder_msi', root_dir = e.root_dir, $",
      "    subdirectory = ['data'])",
      '  raster = e.openRaster(file)',
      '',
      '  ; Print some property values',
      '  print, raster',
      '',
      '  ; Create an output raster',
      '  newFile = e.getTemporaryFilename()',
      '',
      '  ; Retrieve and process data from original raster',
      '  origData = edge_dog(raster.getData(bands = 0))',
      '',
      '  ; Create a raster and save it in newFile',
      '  newRaster = ENVIRaster(origData, uri = newFile, nbands = 1)',
      '  newRaster.save',
      '',
      '  ; Display new raster',
      '  view = e.getView()',
      '  layer = view.createLayer(newRaster)',
      '```',
      '',
      ' The next example shows how to create a new classification raster and add classification metadata to it:',
      '',
      '```idl',
      '  ; Start the application',
      '  e = envi()',
      '',
      '  ; Create an output raster',
      '  File = e.getTemporaryFilename()',
      '',
      '  ; Create data for the classification raster',
      '  data = make_array(500, 500, value = 0, /byte)',
      '  data[0 : 250, 0 : 250] = 1',
      '  data[0 : 250, 251 : 499] = 2',
      '  data[251 : 499, 251 : 499] = 3',
      '',
      '  ; Add classification metadata',
      '  Metadata = ENVIRasterMetadata()',
      "  Metadata.addItem, 'classes', 4",
      "  Metadata.addItem, 'class names', ['Unclassified', 'Water', 'Vegetation', 'Soil']",
      "  Metadata.addItem, 'class lookup', $",
      '    [[!color.black], [!color.blue], [!color.green], [!color.brown]]',
      '',
      '  ; Create a raster and save it in newFile',
      '  Raster = ENVIRaster(data, uri = File, metadata = Metadata)',
      '  Raster.save',
      '',
      '  ; Display new raster',
      '  View = e.getView()',
      '  Layer = View.createLayer(Raster)',
      '```',
      '',
      '### Return Value',
      '',
      'This function returns a reference to an ENVIRaster object.',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0,
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim),
    );
  });

  it(`[auto generated] keywords`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 56, character: 35 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```idl',
      'kw spatialref: ENVIStandardRasterSpatialref | ENVIRPCRasterSpatialref | ENVIPseudoRasterSpatialref | ENVIGLTRasterSpatialRef',
      '```',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0,
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim),
    );
  });
});
