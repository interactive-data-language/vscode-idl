import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
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
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 53, character: 12 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '#### myclass::Init',
      '',
      '```idl',
      'result = object.Init()',
      '```',
      '',
      'Constructor',
      '',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
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
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 56, character: 12 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '#### [ENVIRaster](https://www.nv5geospatialsoftware.com/docs/enviRaster.html)',
      '',
      '```idl',
      'result = ENVIRaster( [ data ], [ data_ignore_value = any ], [ error = String ], [ inherits_from = any ], [ data_type = Number ], [ interleave = String ], [ metadata = ENVIRasterMetadata ], [ nbands = Number ], [ ncolumns = Number ], [ nrows = Number ], [ spatialref = ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef ], [ time = ENVITime ], [ uri = String ], [ auxiliary_spatialref = ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef ], [ auxiliary_uri = Array<String> ], [ coord_sys = ENVICoordSys ], [ /pyramid_exists ], [ /read_only ])',
      '```',
      '',
      'This is a reference to a raster object.',
      '',
      '#### Arguments',
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
      '  * An empty ENVIRaster object is created. You must specify (1) INHERITS\\_FROM or (2) NBANDS, NCOLUMNS, NROWS, **and** DATA\\_TYPE. You can then use [ENVIRaster::SetData](https://www.nv5geospatialsoftware.com/docs/enviRaster__SetData.html) or [ENVIRaster::SetTile](https://www.nv5geospatialsoftware.com/docs/enviRaster__SetTile.html) to add data to the ENVIRaster.',
      '  * The NBANDS, NCOLUMNS, NROWS, and DATA\\_TYPE properties have precedence over the values in the INHERITS\\_FROM raster, if you specify that raster.',
      '',
      '',
      '#### Keywords',
      '',
      '- **data_ignore_value**: bidirectional, optional, any',
      '',
      '    Set this keyword to a pixel value that will be ignored when the raster is displayed. This overrides any data ignore values set in the metadata.',
      '',
      '- **error**: out, optional, String',
      '',
      "    Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (`''`). If an error occurs and the routine is a function, then the function result will be undefined.",
      '    ',
      "    When this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR\\_STATE and CATCH.",
      '    ',
      '    See [Manage Errors](https://www.nv5geospatialsoftware.com/docs/ErrorHandling.html) for more information on error handling in ENVI programming.',
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
      '    See [ENVIRasterMetadata](https://www.nv5geospatialsoftware.com/docs/ENVIRasterMetaData.html) for details on creating and modifying metadata.',
      '    ',
      '    **Note:** If both the SPATIALREF and INHERITS\\_FROM keywords are specified, the spatial reference information from SPATIALREF takes precedence.',
      '',
      '- **data_type**: in, optional, Number',
      '',
      '    An integer or string specifying the raster data type (strings are not case-sensitive). When retrieving the property, a string is returned.',
      '    ',
      '    | String | Value | Data Type                                 |',
      '    | ------ | ----- | ----------------------------------------- |',
      '    | byte   | 1     | Byte (8 bits)                             |',
      '    | double | 5     | Double-precision floating point (64 bits) |',
      '    | float  | 4     | Floating point (32 bits)                  |',
      '    | int    | 2     | Integer (16 bits)                         |',
      '    | long   | 3     | Long integer (32 bits)                    |',
      '    | uint   | 12    | Unsigned integer (16 bits)                |',
      '    | ulong  | 13    | Unsigned long integer (32 bits)           |',
      '    ',
      '    You cannot create or modify an ENVIRaster that contains complex data.',
      '',
      '- **interleave**: in, optional, String',
      '',
      '    A string specifying the interleave of the raster.',
      '    ',
      '    | String | Interleave                | Data Array                        |',
      '    | ------ | ------------------------- | --------------------------------- |',
      '    | bil    | Band interleaved by line  | \\[_ncolumns_, _nbands_, _nrows_\\] |',
      '    | bip    | Band interleaved by pixel | \\[_nbands_, _ncolumns_, _nrows_\\] |',
      '    | bsq    | Band sequential           | \\[_ncolumns_, _nrows_, _nbands_\\] |',
      '',
      '- **metadata**: in, optional, ENVIRasterMetadata',
      '',
      '    This property retrieves a reference to the [ENVIRasterMetadata](https://www.nv5geospatialsoftware.com/docs/ENVIRasterMetaData.html) object. If METADATA and INHERITS\\_FROM are both set, the new raster will have the union of both sets of metadata. The METADATA values override those from INHERITS\\_FROM if there is a conflict.',
      '',
      '- **nbands**: in, optional, Number',
      '',
      '    The number of bands in the raster.',
      '',
      '- **ncolumns**: in, optional, Number',
      '',
      '    The number of columns in the raster.',
      '',
      '- **nrows**: in, optional, Number',
      '',
      '    The number of rows in the raster.',
      '',
      '- **spatialref**: in, optional, ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef',
      '',
      '    This property retrieves a reference to an [ENVIGLTRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIGLTRasterSpatialRef.html), [ENVIPseudoRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIPseudoRasterSpatialRef.html), [ENVIRPCRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIRPCRasterSpatialRef.html), or [ENVIStandardRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIStandardRasterSpatialRef.html) object.',
      '',
      '- **time**: in, optional, ENVITime',
      '',
      '    This property retrieves a reference to the [ENVITime](https://www.nv5geospatialsoftware.com/docs/ENVITime.html) object.',
      '',
      '- **uri**: in, optional, String',
      '',
      '    A string that is a fully qualified raster file path. If not set on initialization, a temporary file will be generated.',
      '',
      '- **auxiliary_spatialref**: in, optional, ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef',
      '',
      '    ',
      '',
      '- **auxiliary_uri**: in, optional, Array<String>',
      '',
      '    ',
      '',
      '- **coord_sys**: in, optional, ENVICoordSys',
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
      '### Return Value',
      '',
      'This function returns a reference to an ENVIRaster object.',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
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
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 56, character: 35 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type spatialref = ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef',
      '```',
      '',
      'This property retrieves a reference to an [ENVIGLTRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIGLTRasterSpatialRef.html), [ENVIPseudoRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIPseudoRasterSpatialRef.html), [ENVIRPCRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIRPCRasterSpatialRef.html), or [ENVIStandardRasterSpatialRef](https://www.nv5geospatialsoftware.com/docs/ENVIStandardRasterSpatialRef.html) object.',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
