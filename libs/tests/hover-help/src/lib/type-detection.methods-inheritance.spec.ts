import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for`, () => {
  it(`[auto generated] function method`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/hover-help/types_inheritance.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 10, character: 13 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/enviRaster__GetData.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22fm%22,%22name%22:%22ENVIRaster::getData%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: Array<Number>',
      ';+',
      'result = ENVIRaster.getData( $',
      '  bands = value $',
      '  complex_function = value $',
      '  error = value $',
      '  interleave = value $',
      '  interpolation = value $',
      '  pixel_state = value $',
      '  roi = value $',
      '  sub_rect = value $',
      '  xfactor = value $',
      '  yfactor = value)',
      '```',
      '',
      'This method returns the raster data (either all of the data or a subset).',
      '',
      '',
      '#### Keywords',
      '',
      '- **bands**: in, optional, Array<Number>',
      '',
      '    An array of integer indices that define the spectral subset to be returned. The indices are sequential and zero-based (Band 1 = 0, Band 2 = 1, etc.) By default, all bands will be returned.',
      '    ',
      '    If the ENVIRaster contains complex data, the BANDS keyword applies only to complex bands, not including the bands containing the real and imaginary components. For instance, for two complex bands, you would set `BANDS=[0,1]`, not `BANDS=[0,3]`.',
      '',
      '- **complex_function**: in, optional, any',
      '',
      '    If the ENVIRaster contains complex data:',
      '    ',
      '    Calling ENVIRaster::GetData with the COMPLEX\\_FUNCTION keyword returns the raster data after the complex function is applied. The band values will be of type FLOAT or DOUBLE (FLOAT if the data is single-precision complex and DOUBLE if it is double-precision complex). If the raster does not contain complex data, setting this keyword causes an error.',
      '    ',
      "    Calling ENVIRaster::GetData without the COMPLEX\\_FUNCTION keyword returns the raw complex data directly from the file as either COMPLEX (6) or DCOMPLEX (9) data. This data type corresponds to the raster's DATA\\_TYPE property.",
      '',
      '- **error**: out, optional, String',
      '',
      "    Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (`''`). If an error occurs and the routine is a function, then the function result will be undefined.",
      '    ',
      "    When this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR\\_STATE and CATCH.",
      '    ',
      '    See [Manage Errors](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ErrorHandling.htm%22%7D) for more information on error handling in ENVI programming.',
      '',
      "- **interleave**: in, optional, 'bil' | 'bip' | 'bsq'",
      '',
      '    By default, when the INTERLEAVE keyword is _not_ set, the returned raster has the same interleave as the source ENVIRaster.',
      '    ',
      '    You can optionally set the INTERLEAVE keyword to a string specifying the desired interleave of the returned data:',
      '    ',
      '    | String | Interleave                | Data Array                        |',
      '    | ------ | ------------------------- | --------------------------------- |',
      '    | bil    | Band interleaved by line  | \\[_ncolumns_, _nbands_, _nrows_\\] |',
      '    | bip    | Band interleaved by pixel | \\[_nbands_, _ncolumns_, _nrows_\\] |',
      '    | bsq    | Band sequential           | \\[_ncolumns_, _nrows_, _nbands_\\] |',
      '',
      "- **interpolation**: in, optional, 'nearest neighbor' | 'pixel aggregate'",
      '',
      "    Set this keyword to `'nearest neighbor'` or `'pixel aggregate'` to indicate the preferred resampling method. The default value is `'nearest neighbor'`. This keyword has no effect if XFACTOR or YFACTOR is not set.",
      '',
      '- **pixel_state**: out, optional, Array<Number>',
      '',
      '    Set this keyword to a named variable that contains a byte array indicating the state of every pixel returned. The returned values are the sum of the bit values of the accumulated pixel states for every pixel returned.',
      '    ',
      '    PIXEL\\_STATE has three bits of information to determine if you want to use the corresponding pixel value in calculation:',
      '    ',
      '    * 1: No Data (Data Ignore Value, NaN, Inf for floating point rasters)',
      '    * 2: Mask',
      '    * 4: Outside of ROI',
      '    ',
      '    The PIXEL\\_STATE value for a pixel could be any combination of the above bits:',
      '    ',
      '    * 0 = Good Pixel',
      '    * 1 = No Data',
      '    * 2 = Mask',
      '    * 3 = No Data + Mask',
      '    * 4 = Outside of ROI',
      '    * 5 = No Data + Outside of ROI',
      '    * 6 = Mask + Outside of ROI',
      '    * 7 = No Data + Mask + Outside of ROI',
      '    ',
      '    See [Raster Pixel State](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ProgrammingGuideWorkingWithRasters.htm#RastPixelState%22%7D) for more details.',
      '    ',
      '    If you set the XFACTOR or YFACTOR keywords, no PIXEL\\_STATE value will be returned.',
      '',
      '- **roi**: bidirectional, optional, any',
      '',
      '    Set this keyword to an [ENVIROI](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRoi/ENVIRoi.htm%22%7D) object to get the data values of the pixels contained in the region of interest (ROI) associated with the input ENVIRaster. If you set this keyword, you cannot set the SUB\\_RECT, XFACTOR, YFACTOR, or INTERPOLATION keywords because those are meant for rectangular subsets of data. ',
      '    ',
      '    When you set the ROI keyword, the GetData method returns a 2D array with the following:',
      '    ',
      '    * \\[_nPixels_, _nBands_\\] when INTERLEAVE is `bsq` or `bil`',
      '    * \\[_nBands_, _nPixels_\\] when INTERLEAVE is `bip`',
      '    ',
      '    Where _nPixels_ is the number of raster pixels that the ROI contains. This is the same number of pixels you would get from calling the ENVIROI::PixelAddresses method. The pixel addresses will be the same too.',
      '    ',
      '    See More Examples below for a code example that uses the ROI keyword.',
      '    ',
      '    _Note:_ Big ROIs will return a large amount of data. To avoid returning too much data in a single read, see the second code example in [How do I process the pixels within an ROI?](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ProgrammingGuideFAQ.htm#How6%22%7D) for an alternative way to extract ROI data.',
      '',
      '- **sub_rect**: out, optional, Array<Number>',
      '',
      '    Set this keyword to a four-element array expressing the spatial range (in pixels) of the data. The array is of the form \\[_x1_, _y1_, _x2_, _y2_\\], where:',
      '    ',
      '    _x1_ \\= First pixel of the columns dimension',
      '    ',
      '    _y1_ \\= First pixel of the rows dimension',
      '    ',
      '    _x2_ \\= Last pixel of the columns dimension',
      '    ',
      '    _y2_ \\= Last pixel of the rows dimension',
      '    ',
      '    Pixel coordinates are zero-based.',
      '    ',
      '    If you want to use a subset of the input data for image processing, consider using the [ENVISubsetRaster](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVISubsetRaster/ENVISubsetRaster.htm%22%7D) function instead.',
      '',
      '- **xfactor**: bidirectional, optional, any',
      '',
      '    Set this keyword to a floating-point value less than or equal to 1.0, indicating the scale factor in the _x_ direction when retrieving the data.',
      '',
      '- **yfactor**: bidirectional, optional, any',
      '',
      '    Set this keyword to a floating-point value less than or equal to 1.0, indicating the scale factor in the _y_ direction when retrieving the data.',
      '',
      '',
      '',
      '### Example',
      '',
      '```idl',
      '  ; Launch the application and open a file',
      '  e = envi()',
      "  file = filepath('qb_boulder_msi', root_dir = e.root_dir, $",
      "    subdirectory = ['data'])",
      '  raster = e.openRaster(file)',
      '',
      '  ; Get the first band with a subset, refactoring the',
      '  ; size in the x and y direction',
      '  data = raster.getData(bands = [0], sub_rect = [100, 449, 550, 899])',
      '',
      '  ; Create a new raster of the subsetted data',
      '  newfile = e.getTemporaryFilename()',
      '  new_raster = ENVIRaster(data, uri = newfile)',
      '  new_raster.save',
      '',
      '  ; Display the subset',
      '  view = e.getView()',
      '  layer = view.createLayer(new_raster)',
      '```',
      '',
      'See More Examples.',
      '',
      '### Return Value',
      '',
      'This method returns an array of data values specified by the keywords below. If you do not specify any keywords, this method returns the entire data set at full resolution with the interleave defined by the data source.',
      '',
      '### More Examples',
      '',
      'The following example prints the mean value for each ROI (for each band) associated with an input raster:',
      '',
      '```idl',
      '  pro GetROIExample',
      '    compile_opt idl2',
      '',
      '    ; Start the application',
      '    e = envi(/headless)',
      '',
      '    ; Open an input raster',
      "    file = filepath('qb_boulder_msi', root_dir = e.root_dir, $",
      "      subdirectory = ['data'])",
      '    raster = e.openRaster(file)',
      '',
      '    ; Open an ROI file',
      "    file = filepath('qb_boulder_roi.xml', root_dir = e.root_dir, $",
      "      subdirectory = ['data'])",
      '    rois = e.openROI(file)',
      '',
      '    foreach roi, rois do begin',
      '      pixelData = raster.getData(roi = roi)',
      '      meanValue = total(pixelData, 1) / roi.pixelCount(raster)',
      "      print, 'Roi: ' + roi.name",
      "      print, 'Mean = ', meanValue",
      '    endforeach',
      '  end',
      '```',
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

  it(`[auto generated] procedure methods`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/hover-help/types_inheritance.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 13, character: 6 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/enviRaster__Save.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22pm%22,%22name%22:%22ENVIRaster::save%22%7D)',
      '',
      '```idl',
      'ENVIRaster.save, $',
      '  error = value, $',
      '  /hidden',
      '```',
      '',
      'This method closes the ENVIRaster for writing and converts it to read-only mode. After calling Save, the ENVIRaster is still available for display and for accessing data as input for processing.',
      '',
      '_Note:_ You must call Save when you are finished writing data to the new raster, or the resulting ENVIRaster object will be left in an incomplete state (you can not display it or retrieve data from it).',
      '',
      'Saving an ENVIRaster overwrites any associated auxiliary files such as [pyramid files](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExploreImagery/BackgroundPyramids.htm%22%7D) (`.enp`) that are automatically created.',
      '',
      '',
      '#### Keywords',
      '',
      '- **error**: out, optional, String',
      '',
      "    Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (`''`). If an error occurs and the routine is a function, then the function result will be undefined.",
      '    ',
      "    When this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR\\_STATE and CATCH.",
      '    ',
      '    See [Manage Errors](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ErrorHandling.htm%22%7D) for more information on error handling in ENVI programming.',
      '',
      '- **hidden**: bidirectional, optional, Boolean',
      '',
      '    Set this keyword if you do not want the resulting raster to be added to the Data Manager after it has been saved. If you do not set this keyword, the default behavior is to add it.',
      '',
      '',
      '',
      '### Example',
      '',
      '```idl',
      '  ; Launch the application',
      '  e = envi()',
      '',
      '  ; Create an ENVIRaster',
      "  file = filepath('qb_boulder_msi', root_dir = e.root_dir, $",
      "    subdirectory = ['data'])",
      '  raster = e.openRaster(file)',
      '',
      '  ; Create an output raster that contains a single band from original',
      '  newFile = e.getTemporaryFilename()',
      '',
      '  ; Retrieve data from original raster',
      '  origData = raster.getData(bands = 0)',
      '',
      '  ; Create raster and save it in newFile',
      '  newRaster = ENVIRaster(origData, uri = newFile, nbands = 1)',
      '  newRaster.save',
      '',
      '  ; Display new data',
      '  view = e.getView()',
      '  layer = view.createLayer(newRaster)',
      '```',
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
