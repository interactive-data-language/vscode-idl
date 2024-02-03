import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify types being used for`, () => {
  it(`[auto generated] methods`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 10, character: 8 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'auxiliary_spatialref',
        insertText: 'auxiliary_spatialref',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to an [ENVIGLTRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIGLTRasterSpatialRef/ENVIGLTRasterSpatialRef.htm%22%7D), [ENVIPseudoRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIPseudoRasterSpatialRef/ENVIPseudoRasterSpatialRef.htm%22%7D), [ENVIRPCRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRPCRasterSpatialRef/ENVIRPCRasterSpatialRef.htm%22%7D), or [ENVIStandardRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIStandardRasterSpatialRef/ENVIStandardRasterSpatialRef.htm%22%7D) object, depending on what secondary map information the raster object uses for spatial reference (if any). This property provides a simple way to view secondary map information without having to query the metadata in the file header.\n\n* If the raster object only has one spatial reference, this property returns a !NULL value.\n* If the raster object contains standard map information plus RPC or pseudo information, the standard map information will be used as the primary spatial reference (returned by the SPATIALREF property) and the RPC or pseudo information will be the auxiliary spatial reference (returned by the AUXILIARY\\_SPATIALREF property). RPC information will be written to the header file (for ENVI-format files) if you call [ENVIRaster::WriteMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/ENVIRaster%255F%255FWriteMetadata.htm%22%7D).\n* If the raster object contains RPC and pseudo map information, the RPC information will be used as the primary spatial reference (returned by the SPATIALREF property).',
        },
      },
      {
        label: 'auxiliary_uri',
        insertText: 'auxiliary_uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a string array containing the URIs for any auxiliary files associated with the raster file. Auxiliary files are files that ENVI creates, specifically header and pyramid files. If there are no associated files, !NULL is returned.',
        },
      },
      {
        label: 'coord_sys',
        insertText: 'coord_sys',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVICoordSys](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVICoordSys/ENVICoordSys.htm%22%7D) associated with the raster.',
        },
      },
      {
        label: 'data_type',
        insertText: 'data_type',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'An integer or string specifying the raster data type (strings are not case-sensitive). When retrieving the property, a string is returned.\n\n| String | Value | Data Type                                 |\n| ------ | ----- | ----------------------------------------- |\n| byte   | 1     | Byte (8 bits)                             |\n| double | 5     | Double-precision floating point (64 bits) |\n| float  | 4     | Floating point (32 bits)                  |\n| int    | 2     | Integer (16 bits)                         |\n| long   | 3     | Long integer (32 bits)                    |\n| uint   | 12    | Unsigned integer (16 bits)                |\n| ulong  | 13    | Unsigned long integer (32 bits)           |\n\nYou cannot create or modify an ENVIRaster that contains complex data.',
        },
      },
      {
        label: 'interleave',
        insertText: 'interleave',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'A string specifying the interleave of the raster.\n\n| String | Interleave                | Data Array                        |\n| ------ | ------------------------- | --------------------------------- |\n| bil    | Band interleaved by line  | \\[_ncolumns_, _nbands_, _nrows_\\] |\n| bip    | Band interleaved by pixel | \\[_nbands_, _ncolumns_, _nrows_\\] |\n| bsq    | Band sequential           | \\[_ncolumns_, _nrows_, _nbands_\\] |',
        },
      },
      {
        label: 'metadata',
        insertText: 'metadata',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) object. If METADATA and INHERITS\\_FROM are both set, the new raster will have the union of both sets of metadata. The METADATA values override those from INHERITS\\_FROM if there is a conflict.',
        },
      },
      {
        label: 'nbands',
        insertText: 'nbands',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value: 'The number of bands in the raster.',
        },
      },
      {
        label: 'ncolumns',
        insertText: 'ncolumns',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value: 'The number of columns in the raster.',
        },
      },
      {
        label: 'nrows',
        insertText: 'nrows',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value: 'The number of rows in the raster.',
        },
      },
      {
        label: 'pyramid_exists',
        insertText: 'pyramid_exists',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'Returns 1 (TRUE) if a pyramid file exists for the raster, and 0 (FALSE) if not.',
        },
      },
      {
        label: 'read_only',
        insertText: 'read_only',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'Returns 1 (TRUE) if ENVIRaster is read-only, and 0 (FALSE) if not. If the value is 0, the [SetData](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/enviRaster%255F%255FSetData.htm%22%7D) and [Save](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/enviRaster%255F%255FSave.htm%22%7D) methods are available.',
        },
      },
      {
        label: 'spatialref',
        insertText: 'spatialref',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to an [ENVIGLTRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIGLTRasterSpatialRef/ENVIGLTRasterSpatialRef.htm%22%7D), [ENVIPseudoRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIPseudoRasterSpatialRef/ENVIPseudoRasterSpatialRef.htm%22%7D), [ENVIRPCRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRPCRasterSpatialRef/ENVIRPCRasterSpatialRef.htm%22%7D), or [ENVIStandardRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIStandardRasterSpatialRef/ENVIStandardRasterSpatialRef.htm%22%7D) object.',
        },
      },
      {
        label: 'time',
        insertText: 'time',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVITime](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVITime/ENVITime.htm%22%7D) object.',
        },
      },
      {
        label: 'uri',
        insertText: 'uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'A string that is a fully qualified raster file path. If not set on initialization, a temporary file will be generated.',
        },
      },
      {
        label: 'ENVIRaster::getData()',
        insertText: 'getData()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRaster::createTileIterator()',
        insertText: 'createTileIterator()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
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
    // define position
    const position_1: Position = { line: 13, character: 4 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'auxiliary_spatialref',
        insertText: 'auxiliary_spatialref',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to an [ENVIGLTRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIGLTRasterSpatialRef/ENVIGLTRasterSpatialRef.htm%22%7D), [ENVIPseudoRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIPseudoRasterSpatialRef/ENVIPseudoRasterSpatialRef.htm%22%7D), [ENVIRPCRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRPCRasterSpatialRef/ENVIRPCRasterSpatialRef.htm%22%7D), or [ENVIStandardRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIStandardRasterSpatialRef/ENVIStandardRasterSpatialRef.htm%22%7D) object, depending on what secondary map information the raster object uses for spatial reference (if any). This property provides a simple way to view secondary map information without having to query the metadata in the file header.\n\n* If the raster object only has one spatial reference, this property returns a !NULL value.\n* If the raster object contains standard map information plus RPC or pseudo information, the standard map information will be used as the primary spatial reference (returned by the SPATIALREF property) and the RPC or pseudo information will be the auxiliary spatial reference (returned by the AUXILIARY\\_SPATIALREF property). RPC information will be written to the header file (for ENVI-format files) if you call [ENVIRaster::WriteMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/ENVIRaster%255F%255FWriteMetadata.htm%22%7D).\n* If the raster object contains RPC and pseudo map information, the RPC information will be used as the primary spatial reference (returned by the SPATIALREF property).',
        },
      },
      {
        label: 'auxiliary_uri',
        insertText: 'auxiliary_uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a string array containing the URIs for any auxiliary files associated with the raster file. Auxiliary files are files that ENVI creates, specifically header and pyramid files. If there are no associated files, !NULL is returned.',
        },
      },
      {
        label: 'coord_sys',
        insertText: 'coord_sys',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVICoordSys](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVICoordSys/ENVICoordSys.htm%22%7D) associated with the raster.',
        },
      },
      {
        label: 'data_type',
        insertText: 'data_type',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'An integer or string specifying the raster data type (strings are not case-sensitive). When retrieving the property, a string is returned.\n\n| String | Value | Data Type                                 |\n| ------ | ----- | ----------------------------------------- |\n| byte   | 1     | Byte (8 bits)                             |\n| double | 5     | Double-precision floating point (64 bits) |\n| float  | 4     | Floating point (32 bits)                  |\n| int    | 2     | Integer (16 bits)                         |\n| long   | 3     | Long integer (32 bits)                    |\n| uint   | 12    | Unsigned integer (16 bits)                |\n| ulong  | 13    | Unsigned long integer (32 bits)           |\n\nYou cannot create or modify an ENVIRaster that contains complex data.',
        },
      },
      {
        label: 'interleave',
        insertText: 'interleave',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'A string specifying the interleave of the raster.\n\n| String | Interleave                | Data Array                        |\n| ------ | ------------------------- | --------------------------------- |\n| bil    | Band interleaved by line  | \\[_ncolumns_, _nbands_, _nrows_\\] |\n| bip    | Band interleaved by pixel | \\[_nbands_, _ncolumns_, _nrows_\\] |\n| bsq    | Band sequential           | \\[_ncolumns_, _nrows_, _nbands_\\] |',
        },
      },
      {
        label: 'metadata',
        insertText: 'metadata',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) object. If METADATA and INHERITS\\_FROM are both set, the new raster will have the union of both sets of metadata. The METADATA values override those from INHERITS\\_FROM if there is a conflict.',
        },
      },
      {
        label: 'nbands',
        insertText: 'nbands',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value: 'The number of bands in the raster.',
        },
      },
      {
        label: 'ncolumns',
        insertText: 'ncolumns',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value: 'The number of columns in the raster.',
        },
      },
      {
        label: 'nrows',
        insertText: 'nrows',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value: 'The number of rows in the raster.',
        },
      },
      {
        label: 'pyramid_exists',
        insertText: 'pyramid_exists',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'Returns 1 (TRUE) if a pyramid file exists for the raster, and 0 (FALSE) if not.',
        },
      },
      {
        label: 'read_only',
        insertText: 'read_only',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'Returns 1 (TRUE) if ENVIRaster is read-only, and 0 (FALSE) if not. If the value is 0, the [SetData](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/enviRaster%255F%255FSetData.htm%22%7D) and [Save](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRaster/enviRaster%255F%255FSave.htm%22%7D) methods are available.',
        },
      },
      {
        label: 'spatialref',
        insertText: 'spatialref',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to an [ENVIGLTRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIGLTRasterSpatialRef/ENVIGLTRasterSpatialRef.htm%22%7D), [ENVIPseudoRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIPseudoRasterSpatialRef/ENVIPseudoRasterSpatialRef.htm%22%7D), [ENVIRPCRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRPCRasterSpatialRef/ENVIRPCRasterSpatialRef.htm%22%7D), or [ENVIStandardRasterSpatialRef](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIStandardRasterSpatialRef/ENVIStandardRasterSpatialRef.htm%22%7D) object.',
        },
      },
      {
        label: 'time',
        insertText: 'time',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVITime](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVITime/ENVITime.htm%22%7D) object.',
        },
      },
      {
        label: 'uri',
        insertText: 'uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIRaster',
        documentation: {
          kind: 'markdown',
          value:
            'A string that is a fully qualified raster file path. If not set on initialization, a temporary file will be generated.',
        },
      },
      {
        label: 'ENVIRaster::close',
        insertText: 'close',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::save',
        insertText: 'save',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::setData',
        insertText: 'setData',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::setTile',
        insertText: 'setTile',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::createPyramid',
        insertText: 'createPyramid',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::export',
        insertText: 'export',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::exportROIs',
        insertText: 'exportROIs',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::writeMetadata',
        insertText: 'writeMetadata',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVIRaster::getData()',
        insertText: 'getData()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRaster::createTileIterator()',
        insertText: 'createTileIterator()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
    // define position
    const position_2: Position = { line: 26, character: 12 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'IDLgrSurface::getCTM()',
        insertText: 'getCtm',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::editUserDefProperty()',
        insertText: 'editUserDefProperty',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getFullIdentifier()',
        insertText: 'getFullIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getPropertyByIdentifier()',
        insertText: 'getPropertyByIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::queryProperty()',
        insertText: 'queryProperty',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
    ];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2
        )
      ).slice(0, 50)
    );
  });
});
