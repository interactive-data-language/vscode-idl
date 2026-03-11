import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack, TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/SetRasterMetadata.task'
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'envisetrastermetadatatask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVISetRasterMetadataTask',
          source: 'user',
          docs: "\nThis task sets metadata for a raster file.\n\n### Syntax\n\n```idl\n;+\n; :Returns: ENVITask<SetRasterMetadata>\n;-\nmyTask = ENVITask('SetRasterMetadata')\n\n; set input parameters\nmyTask.input_raster = value\nmyTask.raster_filename = value\nmyTask.header_location = value\nmyTask.ncolumns = value\nmyTask.nrows = value\nmyTask.nbands = value\nmyTask.interleave = value\nmyTask.byte_order = value\nmyTask.data_type = value\nmyTask.file_type = value\nmyTask.header_offset = value\nmyTask.x_start = value\nmyTask.y_start = value\nmyTask.default_stretch = value\nmyTask.acquisition_time = value\nmyTask.band_names = value\nmyTask.classes = value\nmyTask.class_names = value\nmyTask.class_lookup = value\nmyTask.cloud_cover = value\nmyTask.complex_function = value\nmyTask.data_ignore_value = value\nmyTask._description = value\nmyTask.data_gain_values = value\nmyTask.data_offset_values = value\nmyTask.data_reflectance_gain_values = value\nmyTask.data_reflectance_offset_values = value\nmyTask.fwhm = value\nmyTask.bbl = value\nmyTask.default_bands = value\nmyTask.spatialref = value\nmyTask.auxiliary_rpc_spatialref = value\nmyTask.read_procedures = value\nmyTask.z_plot_titles = value\nmyTask.z_plot_range = value\nmyTask.reflectance_scale_factor = value\nmyTask.security_tag = value\nmyTask.sensor_type = value\nmyTask.dem_file = value\nmyTask.dem_band = value\nmyTask.wavelength = value\nmyTask.wavelength_units = value\nmyTask.sun_elevation = value\nmyTask.sun_azimuth = value\nmyTask.solar_irradiance = value\nmyTask.timestamp = value\nmyTask.custom_metadata = value\nmyTask.output_raster_uri = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\noutput_raster = myTask.output_raster\n\n```\n\n\n### Input Parameters\n\n- **input_raster**: ENVIRaster\n\n  Specify a raster on which to perform the metadata edition.\n\n- **raster_filename**: String\n\n  Filename string of the input raster.\n\n- **header_location**: 'Same as raster file' | 'Auxiliary File Directory'\n\n  Directory where the file's header, which contains the new metadata, will be saved.\n\n- **ncolumns**: ULong\n\n  The number of column or samples per image for each band.\n\n- **nrows**: ULong\n\n  The number of lines or rows per image for each band.\n\n- **nbands**: ULong\n\n  The number of bands per image file.\n\n- **interleave**: 'BSQ' | 'BIL' | 'BIP'\n\n  Specifies the data interleave of the raster.\n\n- **byte_order**: 'Host (Intel)' | 'Network (IEEE)'\n\n  The order of the bytes in integer, long integer, 64-bit integer, unsigned 64-bit integer, floating point, double precision, and complex data types. Byte order=0 (Host (Intel) in the Header Info dialog) is least significant byte first (LSF) data (DEC and MS-DOS systems). Byte order=1 (Network (IEEE) in the Header Info dialog) is most significant byte first (MSF) data (all other platforms).\n\n- **data_type**: 'Byte' | 'Integer' | 'Long Integer' | 'Float' | 'Double' | 'Complex' | 'Double-precision Complex' | 'Unsigned Integer' | 'Unsigned Long Integer' | '64-bit Long Integer' | '64-bit Unsigned Long Integer'\n\n  The data type of the raster pixel data.\n\n- **file_type**: String\n\n  File type in which the raster is stored.\n\n- **header_offset**: ULong64\n\n  The number of bytes of embedded header information present in the file (for example, 128 bytes for ERDAS 7.5 .lan files). ENVI skips these bytes when reading the file.\n\n- **x_start**: ULong\n\n  Defines the X image coordinate for the upper-left pixel in the image. Images that are spatial subsets of larger images often use an image coordinate system that references the parent (or larger) image so that you can link and dynamically overlay the two images.\n\n- **y_start**: ULong\n\n  Defines the Y image coordinate for the upper-left pixel in the image. Images that are spatial subsets of larger images often use an image coordinate system that references the parent (or larger) image so that you can link and dynamically overlay the two images.\n\n- **default_stretch**: String\n\n  Determines what type of stretch (% linear, linear range, Gaussian, equalization, square root) to use when ENVI displays the image.\n\n- **acquisition_time**: String\n\n  Data acquisition time string that conforms to the ISO-8601 standard..\n\n- **band_names**: Array\\<String\\>\n\n  The names of image bands.\n\n- **classes**: UInt\n\n  The number of classes in the image.\n\n- **class_names**: Array\\<String\\>\n\n  Lists class names for classification files.\n\n- **class_lookup**: Array\\<Byte\\>\n\n  Lists class colors using RGB color definitions for classification files.\n\n- **cloud_cover**: Float\n\n  Percentage of cloud cover within the raster.\n\n- **complex_function**: 'Power' | 'Magnitude' | 'Real' | 'Imaginary' | 'Phase'\n\n  Specifies the values to calculate from a complex image and to use when displaying the image, calculating statistics for the image, or writing the image to a new file.\n\n- **data_ignore_value**: Double\n\n  Pixel value that should be ignored in image processing.\n\n- **_description**: Array\\<String\\>\n\n  A string describing the image or the processing performed.\n\n- **data_gain_values**: Array\\<Double\\>\n\n  Gain values for each band. Units are W/(m2 * um * sr).\n\n- **data_offset_values**: Array\\<Double\\>\n\n  Offset values for each band.\n\n- **data_reflectance_gain_values**: Array\\<Double\\>\n\n  An array of reflectance gain values.\n\n- **data_reflectance_offset_values**: Array\\<Double\\>\n\n  An array of reflectance offset values.\n\n- **fwhm**: Array\\<Double\\>\n\n  Lists full-width-half-maximum (FWHM) values of each band in an image.\n\n- **bbl**: Array\\<Int\\>\n\n  List of bad bands in an image.\n\n- **default_bands**: Array\\<ULong\\>\n\n  Indicates which band numbers to automatically load into the current view every time the file is opened.\n\n- **spatialref**: _ENVISpatialRef\n\n  Specifies a spatial reference for the raster.\n\n- **auxiliary_rpc_spatialref**: ENVIRPCRasterSpatialRef\n\n  Specifies rational polynomial coefficient (RPC) geolocation information for the raster that can be used in addition to standard map information.\n\n- **read_procedures**: Array\\<String\\>\n\n  Spatial and spectral read routines that define custom file readers.\n\n- **z_plot_titles**: Array\\<String\\>\n\n  The x and y axis titles for Z plots.\n\n- **z_plot_range**: Array\\<Double\\>\n\n  The default minimum and maximum values for Z plots.\n\n- **reflectance_scale_factor**: Double\n\n  The value that, when divided into your data, would scale it from 0-1 reflectance. For example, if the value of 10,000 in your data represents a reflectance value of 1.0, enter a reflectance scale factor of 10,000.\n\n- **security_tag**: String\n\n  A string with security information inherited from formats that typically contain security classification levels (such as NITF).\n\n- **sensor_type**: ENVISensorName\n\n  Instrument types, such as Landsat TM, SPOT, RADARSAT, etc.\n\n- **dem_file**: String\n\n  Path and filename of a DEM associated with the image.\n\n- **dem_band**: UInt\n\n  Index (starting at 1) of a selected DEM band associated with the image.\n\n- **wavelength**: Array\\<Double\\>\n\n  Lists the center wavelength values of each band in an image. Units should be the same as those used for the fwhm field and set in the wavelength units parameter.\n\n- **wavelength_units**: 'Micrometers' | 'Nanometers' | 'Wavenumber' | 'GHz' | 'MHz' | 'Index' | 'Unknown'\n\n  Specifies the units of the wavelength information.\n\n- **sun_elevation**: Double\n\n  Angle of the sun (in degrees) above the horizon.\n\n- **sun_azimuth**: Double\n\n  Angle of the sun (in degrees) from due north in a clockwise direction.\n\n- **solar_irradiance**: Array\\<Double\\>\n\n  Top of the atmosphere solar irradiance per band. Units are W/(m2 * um).\n\n- **timestamp**: Array\\<String\\>\n\n  Temporal Cube Timestamps.\n\n- **custom_metadata**: Hash\\<any\\>\n\n  A hash of key-value pairs indicating user-defined custom metadata items not defined in the ENVI header file format.\n\n- **output_raster_uri**: String\n\n  Specify a string with the fully-qualified path and filename for output_raster.\n\n\n\n### Output Parameters\n\n- **output_raster**: ENVIRaster\n\n  Updating the header file requires closing the raster. Use this parameter to reopen the file a return a reference to the new raster.\n\n",
          private: false,
          returns: [
            {
              name: 'envisetrastermetadatatask',
              display: 'ENVITask<setrastermetadata>',
              serialized: 'ENVITask<setrastermetadata>',
              args: [
                [
                  {
                    name: 'setrastermetadata',
                    display: 'setrastermetadata',
                    serialized: 'setrastermetadata',
                    args: [],
                    meta: {},
                  },
                ],
              ],
              meta: {},
            },
          ],
          args: {},
          kws: {},
          docsLookup: {},
          struct: [],
        },
      },
      structure: {
        type: 's',
        name: 'envisetrastermetadatatask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVISetRasterMetadataTask',
          source: 'user',
          docs: "This task sets metadata for a raster file.\n\n\n### Properties\n\n- **input_raster**: ENVIRaster\n\n  Specify a raster on which to perform the metadata edition.\n\n- **raster_filename**: String\n\n  Filename string of the input raster.\n\n- **header_location**: 'Same as raster file' | 'Auxiliary File Directory'\n\n  Directory where the file's header, which contains the new metadata, will be saved.\n\n- **ncolumns**: ULong\n\n  The number of column or samples per image for each band.\n\n- **nrows**: ULong\n\n  The number of lines or rows per image for each band.\n\n- **nbands**: ULong\n\n  The number of bands per image file.\n\n- **interleave**: 'BSQ' | 'BIL' | 'BIP'\n\n  Specifies the data interleave of the raster.\n\n- **byte_order**: 'Host (Intel)' | 'Network (IEEE)'\n\n  The order of the bytes in integer, long integer, 64-bit integer, unsigned 64-bit integer, floating point, double precision, and complex data types. Byte order=0 (Host (Intel) in the Header Info dialog) is least significant byte first (LSF) data (DEC and MS-DOS systems). Byte order=1 (Network (IEEE) in the Header Info dialog) is most significant byte first (MSF) data (all other platforms).\n\n- **data_type**: 'Byte' | 'Integer' | 'Long Integer' | 'Float' | 'Double' | 'Complex' | 'Double-precision Complex' | 'Unsigned Integer' | 'Unsigned Long Integer' | '64-bit Long Integer' | '64-bit Unsigned Long Integer'\n\n  The data type of the raster pixel data.\n\n- **file_type**: String\n\n  File type in which the raster is stored.\n\n- **header_offset**: ULong64\n\n  The number of bytes of embedded header information present in the file (for example, 128 bytes for ERDAS 7.5 .lan files). ENVI skips these bytes when reading the file.\n\n- **x_start**: ULong\n\n  Defines the X image coordinate for the upper-left pixel in the image. Images that are spatial subsets of larger images often use an image coordinate system that references the parent (or larger) image so that you can link and dynamically overlay the two images.\n\n- **y_start**: ULong\n\n  Defines the Y image coordinate for the upper-left pixel in the image. Images that are spatial subsets of larger images often use an image coordinate system that references the parent (or larger) image so that you can link and dynamically overlay the two images.\n\n- **default_stretch**: String\n\n  Determines what type of stretch (% linear, linear range, Gaussian, equalization, square root) to use when ENVI displays the image.\n\n- **acquisition_time**: String\n\n  Data acquisition time string that conforms to the ISO-8601 standard..\n\n- **band_names**: Array\\<String\\>\n\n  The names of image bands.\n\n- **classes**: UInt\n\n  The number of classes in the image.\n\n- **class_names**: Array\\<String\\>\n\n  Lists class names for classification files.\n\n- **class_lookup**: Array\\<Byte\\>\n\n  Lists class colors using RGB color definitions for classification files.\n\n- **cloud_cover**: Float\n\n  Percentage of cloud cover within the raster.\n\n- **complex_function**: 'Power' | 'Magnitude' | 'Real' | 'Imaginary' | 'Phase'\n\n  Specifies the values to calculate from a complex image and to use when displaying the image, calculating statistics for the image, or writing the image to a new file.\n\n- **data_ignore_value**: Double\n\n  Pixel value that should be ignored in image processing.\n\n- **_description**: Array\\<String\\>\n\n  A string describing the image or the processing performed.\n\n- **data_gain_values**: Array\\<Double\\>\n\n  Gain values for each band. Units are W/(m2 * um * sr).\n\n- **data_offset_values**: Array\\<Double\\>\n\n  Offset values for each band.\n\n- **data_reflectance_gain_values**: Array\\<Double\\>\n\n  An array of reflectance gain values.\n\n- **data_reflectance_offset_values**: Array\\<Double\\>\n\n  An array of reflectance offset values.\n\n- **fwhm**: Array\\<Double\\>\n\n  Lists full-width-half-maximum (FWHM) values of each band in an image.\n\n- **bbl**: Array\\<Int\\>\n\n  List of bad bands in an image.\n\n- **default_bands**: Array\\<ULong\\>\n\n  Indicates which band numbers to automatically load into the current view every time the file is opened.\n\n- **spatialref**: _ENVISpatialRef\n\n  Specifies a spatial reference for the raster.\n\n- **auxiliary_rpc_spatialref**: ENVIRPCRasterSpatialRef\n\n  Specifies rational polynomial coefficient (RPC) geolocation information for the raster that can be used in addition to standard map information.\n\n- **read_procedures**: Array\\<String\\>\n\n  Spatial and spectral read routines that define custom file readers.\n\n- **z_plot_titles**: Array\\<String\\>\n\n  The x and y axis titles for Z plots.\n\n- **z_plot_range**: Array\\<Double\\>\n\n  The default minimum and maximum values for Z plots.\n\n- **reflectance_scale_factor**: Double\n\n  The value that, when divided into your data, would scale it from 0-1 reflectance. For example, if the value of 10,000 in your data represents a reflectance value of 1.0, enter a reflectance scale factor of 10,000.\n\n- **security_tag**: String\n\n  A string with security information inherited from formats that typically contain security classification levels (such as NITF).\n\n- **sensor_type**: ENVISensorName\n\n  Instrument types, such as Landsat TM, SPOT, RADARSAT, etc.\n\n- **dem_file**: String\n\n  Path and filename of a DEM associated with the image.\n\n- **dem_band**: UInt\n\n  Index (starting at 1) of a selected DEM band associated with the image.\n\n- **wavelength**: Array\\<Double\\>\n\n  Lists the center wavelength values of each band in an image. Units should be the same as those used for the fwhm field and set in the wavelength units parameter.\n\n- **wavelength_units**: 'Micrometers' | 'Nanometers' | 'Wavenumber' | 'GHz' | 'MHz' | 'Index' | 'Unknown'\n\n  Specifies the units of the wavelength information.\n\n- **sun_elevation**: Double\n\n  Angle of the sun (in degrees) above the horizon.\n\n- **sun_azimuth**: Double\n\n  Angle of the sun (in degrees) from due north in a clockwise direction.\n\n- **solar_irradiance**: Array\\<Double\\>\n\n  Top of the atmosphere solar irradiance per band. Units are W/(m2 * um).\n\n- **timestamp**: Array\\<String\\>\n\n  Temporal Cube Timestamps.\n\n- **custom_metadata**: Hash\\<any\\>\n\n  A hash of key-value pairs indicating user-defined custom metadata items not defined in the ENVI header file format.\n\n- **output_raster_uri**: String\n\n  Specify a string with the fully-qualified path and filename for output_raster.\n\n- **output_raster**: ENVIRaster\n\n  Updating the header file requires closing the raster. Use this parameter to reopen the file a return a reference to the new raster.\n\n",
          private: false,
          inherits: ['envitask'],
          docsLookup: {},
          props: {
            input_raster: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_raster',
              docs: 'Specify a raster on which to perform the metadata edition.',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  serialized: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
            raster_filename: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: true,
              display: 'raster_filename',
              docs: 'Filename string of the input raster.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: { isUri: true },
                },
              ],
              req: false,
            },
            header_location: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'header_location',
              docs: "Directory where the file's header, which contains the new metadata, will be saved.",
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized:
                    "'Same as raster file' | 'Auxiliary File Directory'",
                  args: [],
                  meta: { default: 'Same as raster file' },
                  value: ['Same as raster file', 'Auxiliary File Directory'],
                },
              ],
              req: false,
            },
            ncolumns: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'ncolumns',
              docs: 'The number of column or samples per image for each band.',
              type: [
                {
                  name: 'ULong',
                  display: 'ULong',
                  serialized: 'ULong',
                  args: [],
                  meta: { min: 1 },
                },
              ],
              req: true,
            },
            nrows: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'nrows',
              docs: 'The number of lines or rows per image for each band.',
              type: [
                {
                  name: 'ULong',
                  display: 'ULong',
                  serialized: 'ULong',
                  args: [],
                  meta: { min: 1 },
                },
              ],
              req: true,
            },
            nbands: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'nbands',
              docs: 'The number of bands per image file.',
              type: [
                {
                  name: 'ULong',
                  display: 'ULong',
                  serialized: 'ULong',
                  args: [],
                  meta: { min: 1 },
                },
              ],
              req: true,
            },
            interleave: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'interleave',
              docs: 'Specifies the data interleave of the raster.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: "'BSQ' | 'BIL' | 'BIP'",
                  args: [],
                  meta: {},
                  value: ['BSQ', 'BIL', 'BIP'],
                },
              ],
              req: true,
            },
            byte_order: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'byte_order',
              docs: 'The order of the bytes in integer, long integer, 64-bit integer, unsigned 64-bit integer, floating point, double precision, and complex data types. Byte order=0 (Host (Intel) in the Header Info dialog) is least significant byte first (LSF) data (DEC and MS-DOS systems). Byte order=1 (Network (IEEE) in the Header Info dialog) is most significant byte first (MSF) data (all other platforms).',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: "'Host (Intel)' | 'Network (IEEE)'",
                  args: [],
                  meta: {},
                  value: ['Host (Intel)', 'Network (IEEE)'],
                },
              ],
              req: true,
            },
            data_type: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_type',
              docs: 'The data type of the raster pixel data.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized:
                    "'Byte' | 'Integer' | 'Long Integer' | 'Float' | 'Double' | 'Complex' | 'Double-precision Complex' | 'Unsigned Integer' | 'Unsigned Long Integer' | '64-bit Long Integer' | '64-bit Unsigned Long Integer'",
                  args: [],
                  meta: {},
                  value: [
                    'Byte',
                    'Integer',
                    'Long Integer',
                    'Float',
                    'Double',
                    'Complex',
                    'Double-precision Complex',
                    'Unsigned Integer',
                    'Unsigned Long Integer',
                    '64-bit Long Integer',
                    '64-bit Unsigned Long Integer',
                  ],
                },
              ],
              req: true,
            },
            file_type: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'file_type',
              docs: 'File type in which the raster is stored.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: { default: 'ENVI' },
                },
              ],
              req: false,
            },
            header_offset: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'header_offset',
              docs: 'The number of bytes of embedded header information present in the file (for example, 128 bytes for ERDAS 7.5 .lan files). ENVI skips these bytes when reading the file.',
              type: [
                {
                  name: 'ULong64',
                  display: 'ULong64',
                  serialized: 'ULong64',
                  args: [],
                  meta: { default: 0 },
                },
              ],
              req: false,
            },
            x_start: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'x_start',
              docs: 'Defines the X image coordinate for the upper-left pixel in the image. Images that are spatial subsets of larger images often use an image coordinate system that references the parent (or larger) image so that you can link and dynamically overlay the two images.',
              type: [
                {
                  name: 'ULong',
                  display: 'ULong',
                  serialized: 'ULong',
                  args: [],
                  meta: { default: 0 },
                },
              ],
              req: false,
            },
            y_start: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'y_start',
              docs: 'Defines the Y image coordinate for the upper-left pixel in the image. Images that are spatial subsets of larger images often use an image coordinate system that references the parent (or larger) image so that you can link and dynamically overlay the two images.',
              type: [
                {
                  name: 'ULong',
                  display: 'ULong',
                  serialized: 'ULong',
                  args: [],
                  meta: { default: 0 },
                },
              ],
              req: false,
            },
            default_stretch: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'default_stretch',
              docs: 'Determines what type of stretch (% linear, linear range, Gaussian, equalization, square root) to use when ENVI displays the image.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            acquisition_time: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'acquisition_time',
              docs: 'Data acquisition time string that conforms to the ISO-8601 standard..',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            band_names: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'band_names',
              docs: 'The names of image bands.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            classes: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'classes',
              docs: 'The number of classes in the image.',
              type: [
                {
                  name: 'UInt',
                  display: 'UInt',
                  serialized: 'UInt',
                  args: [],
                  meta: { min: 1 },
                },
              ],
              req: false,
            },
            class_names: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'class_names',
              docs: 'Lists class names for classification files.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            class_lookup: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'class_lookup',
              docs: 'Lists class colors using RGB color definitions for classification files.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Byte>',
                  serialized: 'Array<Byte>',
                  args: [
                    [
                      {
                        name: 'Byte',
                        display: 'Byte',
                        serialized: 'Byte',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: [3, '*'] },
                },
              ],
              req: false,
            },
            cloud_cover: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'cloud_cover',
              docs: 'Percentage of cloud cover within the raster.',
              type: [
                {
                  name: 'Float',
                  display: 'Float',
                  serialized: 'Float',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            complex_function: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'complex_function',
              docs: 'Specifies the values to calculate from a complex image and to use when displaying the image, calculating statistics for the image, or writing the image to a new file.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized:
                    "'Power' | 'Magnitude' | 'Real' | 'Imaginary' | 'Phase'",
                  args: [],
                  meta: {},
                  value: ['Power', 'Magnitude', 'Real', 'Imaginary', 'Phase'],
                },
              ],
              req: false,
            },
            data_ignore_value: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_ignore_value',
              docs: 'Pixel value that should be ignored in image processing.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            _description: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: '_description',
              docs: 'A string describing the image or the processing performed.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            data_gain_values: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_gain_values',
              docs: 'Gain values for each band. Units are W/(m2 * um * sr).',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            data_offset_values: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_offset_values',
              docs: 'Offset values for each band.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            data_reflectance_gain_values: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_reflectance_gain_values',
              docs: 'An array of reflectance gain values.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            data_reflectance_offset_values: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_reflectance_offset_values',
              docs: 'An array of reflectance offset values.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            fwhm: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'fwhm',
              docs: 'Lists full-width-half-maximum (FWHM) values of each band in an image.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            bbl: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'bbl',
              docs: 'List of bad bands in an image.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Int>',
                  serialized: 'Array<Int>',
                  args: [
                    [
                      {
                        name: 'Int',
                        display: 'Int',
                        serialized: 'Int',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            default_bands: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'default_bands',
              docs: 'Indicates which band numbers to automatically load into the current view every time the file is opened.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ULong>',
                  serialized: 'Array<ULong>',
                  args: [
                    [
                      {
                        name: 'ULong',
                        display: 'ULong',
                        serialized: 'ULong',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            spatialref: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'spatialref',
              docs: 'Specifies a spatial reference for the raster.',
              type: [
                {
                  name: '_ENVISpatialRef',
                  display: '_ENVISpatialRef',
                  serialized: '_ENVISpatialRef',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            auxiliary_rpc_spatialref: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'auxiliary_rpc_spatialref',
              docs: 'Specifies rational polynomial coefficient (RPC) geolocation information for the raster that can be used in addition to standard map information.',
              type: [
                {
                  name: 'ENVIRPCRasterSpatialRef',
                  display: 'ENVIRPCRasterSpatialRef',
                  serialized: 'ENVIRPCRasterSpatialRef',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            read_procedures: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'read_procedures',
              docs: 'Spatial and spectral read routines that define custom file readers.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: [2] },
                },
              ],
              req: false,
            },
            z_plot_titles: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'z_plot_titles',
              docs: 'The x and y axis titles for Z plots.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: [2] },
                },
              ],
              req: false,
            },
            z_plot_range: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'z_plot_range',
              docs: 'The default minimum and maximum values for Z plots.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: [2] },
                },
              ],
              req: false,
            },
            reflectance_scale_factor: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'reflectance_scale_factor',
              docs: 'The value that, when divided into your data, would scale it from 0-1 reflectance. For example, if the value of 10,000 in your data represents a reflectance value of 1.0, enter a reflectance scale factor of 10,000.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            security_tag: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'security_tag',
              docs: 'A string with security information inherited from formats that typically contain security classification levels (such as NITF).',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            sensor_type: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'sensor_type',
              docs: 'Instrument types, such as Landsat TM, SPOT, RADARSAT, etc.',
              type: [
                {
                  name: 'ENVISensorName',
                  display: 'ENVISensorName',
                  serialized: 'ENVISensorName',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            dem_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'dem_file',
              docs: 'Path and filename of a DEM associated with the image.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: { isUri: true },
                },
              ],
              req: false,
            },
            dem_band: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'dem_band',
              docs: 'Index (starting at 1) of a selected DEM band associated with the image.',
              type: [
                {
                  name: 'UInt',
                  display: 'UInt',
                  serialized: 'UInt',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            wavelength: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'wavelength',
              docs: 'Lists the center wavelength values of each band in an image. Units should be the same as those used for the fwhm field and set in the wavelength units parameter.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            wavelength_units: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'wavelength_units',
              docs: 'Specifies the units of the wavelength information.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized:
                    "'Micrometers' | 'Nanometers' | 'Wavenumber' | 'GHz' | 'MHz' | 'Index' | 'Unknown'",
                  args: [],
                  meta: { default: 'Nanometers' },
                  value: [
                    'Micrometers',
                    'Nanometers',
                    'Wavenumber',
                    'GHz',
                    'MHz',
                    'Index',
                    'Unknown',
                  ],
                },
              ],
              req: false,
            },
            sun_elevation: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'sun_elevation',
              docs: 'Angle of the sun (in degrees) above the horizon.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            sun_azimuth: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'sun_azimuth',
              docs: 'Angle of the sun (in degrees) from due north in a clockwise direction.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            solar_irradiance: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'solar_irradiance',
              docs: 'Top of the atmosphere solar irradiance per band. Units are W/(m2 * um).',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  serialized: 'Array<Double>',
                  args: [
                    [
                      {
                        name: 'Double',
                        display: 'Double',
                        serialized: 'Double',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            timestamp: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'timestamp',
              docs: 'Temporal Cube Timestamps.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            custom_metadata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: true,
              display: 'custom_metadata',
              docs: 'A hash of key-value pairs indicating user-defined custom metadata items not defined in the ENVI header file format.',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<any>',
                  serialized: 'Hash<any>',
                  args: [
                    [
                      {
                        display: 'any',
                        name: 'any',
                        serialized: 'any',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              req: false,
            },
            output_raster_uri: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'output_raster_uri',
              docs: 'Specify a string with the fully-qualified path and filename for output_raster.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: { isUri: true },
                },
              ],
              req: false,
            },
            output_raster: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'output_raster',
              docs: 'Updating the header file requires closing the raster. Use this parameter to reopen the file a return a reference to the new raster.',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  serialized: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
          },
        },
      },
    };

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
