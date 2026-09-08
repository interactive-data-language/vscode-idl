import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { TaskToGlobalToken } from '@idl/parsing/tasks';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse URI parameters and set defaults`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'apps/test/idl/task-parsing/SARsBasicFeFloodingClassification.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'envisarsbasicfefloodingclassificationtask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVISARsBasicFeFloodingClassificationTask',
          source: 'user',
          docs: "\nThis tool creates a classification raster that highlights flooded and permanent water areas. [Technical Note] Here below the requirements regarding the input images Notes\n\n### Syntax\n\n```idl\n;+\n; :Returns: ENVITask<SARsBasicFeFloodingClassification>\n;-\nmyTask = ENVITask('SARsBasicFeFloodingClassification')\n\n; set input parameters\nmyTask.flooding_parameters_selection = value\nmyTask.input_sarscapedata = value\nmyTask.post_event_file = value\nmyTask.land_mask_shape_file = value\nmyTask.dem_file = value\nmyTask.slope_file = value\nmyTask.swl_th = value\nmyTask.dem_th = value\nmyTask.slope_th = value\nmyTask.ratio_th = value\nmyTask.high_scatt_point_th = value\nmyTask.maj_filter_kernel_size = value\nmyTask.land_mask_buffer_meter = value\nmyTask.opencl_platformid = value\nmyTask.opencl_deviceid = value\nmyTask.generate_ql = value\nmyTask.in_triggering_execution_option = value\nmyTask.root_uri_for_output = value\nmyTask.sarscape_preference = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\noutput_sarscapedata = myTask.output_sarscapedata\nout_triggering_execution_option = myTask.out_triggering_execution_option\nfiltr_sarscapedata = myTask.filtr_sarscapedata\nratio_sarscapedata = myTask.ratio_sarscapedata\npre_event_sarscapedata = myTask.pre_event_sarscapedata\npost_event_sarscapedata = myTask.post_event_sarscapedata\n\n```\n\n\n### Input Parameters\n\n- **flooding_parameters_selection**: 'flooding_sml_preferences' | 'flooding_preferences_specific'\n\n   Auto-select from input Parameters will be configured according to the carrier frequency band specified in the SML file. Manual The parameters can be added manually.\n\n- **input_sarscapedata**: Array\\<SARscapeData\\>\n\n   Input file name of the coregistered and geocoded pre-event images. At least one image is required.\n\n- **post_event_file**: SARscapeData\n\n   Input file name of the coregistered and geocoded post-event image. This file is mandatory.\n\n- **land_mask_shape_file**: String\n\n   The algorithm will avoid the areas outside the polygon(s) of the provided shapefile. Note If no mask is loaded, the software will automatically apply mask from the installation folder of SARscape. This mask is derived from OpenStreetMap repository (� OpenStreetMap contributors). These data are licensed under the Open Database License (ODbL). A copy of the modified dataset is available on https//www.openstreetmap.org/. For details, see Copyright and License and Open Data Commons Open Database License (ODbL) � Open Data Commons legal tools for open data and Third-party software and libraries of SARscape .\n\n- **dem_file**: SARscapeData\n\n   Digital Elevation Model file name. This should be referred to the ellipsoid. In case a list of input files is entered, the DEM must cover the whole imaged area.\n\n- **slope_file**: SARscapeData\n\n   Slope file name.\n\n- **swl_th**: Double\n\n   This is the minimum dB value that will be used to detect the presence of water, all the pixels under this value will be considered. In case of stable water area between the pre-event image and the post event image, the area will be classified as Persistent Water Area. This parameter is band dependent and it is automatically set from the Flooding Menu inside Preferences Common.\n\n- **dem_th**: Double\n\n   This is the minimum m value that will be used to remove the presence of Stable Water or Flood, all the pixels over this value will be considered.\n\n- **slope_th**: Double\n\n   This is the minimum deg value that will be used to remove the presence of Stable Water or Flood, all the pixels over this value will be considered.\n\n- **ratio_th**: Double\n\n   This is the minimum ratio value between pre-event and post-event image, that will be used to detect the presence of a flooded area. All the pixels over this value will be considered. In case of the presence of water in the area and a sufficient ratio value, the area will be classified as Flooded Area. This parameter is band dependant and it is automatically set from the Flooding Menu inside Preferences Common.\n\n- **high_scatt_point_th**: Double\n\n   This is the backscatter value expressed in decibels relevant to high reflectivity targets, such as ships. This parameter helps avoiding the identification of false positive. Note The side lobes effect may cause the identification of false positive areas surrounding high reflectivity targets.\n\n- **maj_filter_kernel_size**: Double\n\n   This refers to the kernel size of the majority filter used to filter the output classified image.\n\n- **land_mask_buffer_meter**: Double\n\n   Optional buffer area might be defined by a distance around the provided land mask shapefile. A pre-set value  is displayed depending on the input file.\n\n- **opencl_platformid**: String\n\n  Specify the OpenCL platform ID that should be use for parallel computing.\n\n- **opencl_deviceid**: String\n\n  Specify the OpenCL device ID that should be use for parallel computing.\n\n- **generate_ql**: Boolean\n\n  Set this property to True to generate a Quick Look image.\n\n- **in_triggering_execution_option**: String\n\n  Specify a string with the input triggering execution option.\n\n- **root_uri_for_output**: String\n\n  Specify an ENVIURI object with the common URI for all outputs.\n\n- **sarscape_preference**: 'Use actual preferences' | 'General' | 'UHR (better than 1m)' | 'VHR (better than 3m)' | 'VHR (better than 6m)' | 'HR (better than 10m)' | 'MR (between 10m and 30m)' | 'LR (coarser than 30m)' | 'Interferometry Low Coherence' | 'Wrong Orbital Data' | 'TanDEM-X Bistatic Configuration' | 'CInSAR ERS-ASAR Interferometry' | 'Sentinel TOPSAR (IW - EW)' | 'PALSAR-2 ScanSAR' | 'TSX ScanSAR' | 'Umbra' | 'Squinted Data'\n\n  Specify a case-sensitive string or integer with the preferred SARScape parameters. The choices are 0 (use actual preferences), 1 (General), 2 (UHR (better than 1m)), 3 (VHR (better than 3m)), 4 (VHR (better than 6m)), 5 (HR (better than 10m)), 6 (MR (between 10m and 30m)), 7 (LR (coarser than 30m)), 8 (Interferometry Low Coherence), 9 (Wrong Orbital Data), 10 (TanDEM-X Bistatic Configuration), 11 (CInSAR ERS-ASAR Interferometry), 12 (Sentinel TOPSAR (IW - EW), 13 (PALSAR-2 ScanSAR), 14 (TSX ScanSAR), 15 (Umbra), and 16 (Squinted Data).\n\n\n\n### Output Parameters\n\n- **output_sarscapedata**: SARscapeData\n\n   _class Classified raster file of the flooded areas. _postEvent Mean amplitude image of the post-event image. _preEvent Mean amplitude image based on the list of pre-event images. _ratio Geocoded ratio (expressed in dB) between the post-event backscatter value and the pre-events backscatter value. _class_filtr Filtered classified raster file of the flooded areas.\n\n- **out_triggering_execution_option**: String\n\n  Specify a string with the output triggering execution option.\n\n- **filtr_sarscapedata**: SARscapeData\n\n  This is a Filtred Classified SARscapeData\n\n- **ratio_sarscapedata**: SARscapeData\n\n  This is a Ratio SARscapeData\n\n- **pre_event_sarscapedata**: SARscapeData\n\n  This is a Pre Event SARscapeData\n\n- **post_event_sarscapedata**: SARscapeData\n\n  This is a Post Event SARscapeData\n\n",
          private: false,
          returns: [
            {
              name: 'envisarsbasicfefloodingclassificationtask',
              display: 'ENVITask<sarsbasicfefloodingclassification>',
              serialized: 'ENVITask<sarsbasicfefloodingclassification>',
              args: [
                [
                  {
                    name: 'sarsbasicfefloodingclassification',
                    display: 'sarsbasicfefloodingclassification',
                    serialized: 'sarsbasicfefloodingclassification',
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
        name: 'envisarsbasicfefloodingclassificationtask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVISARsBasicFeFloodingClassificationTask',
          source: 'user',
          docs: "This tool creates a classification raster that highlights flooded and permanent water areas. [Technical Note] Here below the requirements regarding the input images Notes\n\n\n### Properties\n\n- **flooding_parameters_selection**: 'flooding_sml_preferences' | 'flooding_preferences_specific'\n\n   Auto-select from input Parameters will be configured according to the carrier frequency band specified in the SML file. Manual The parameters can be added manually.\n\n- **input_sarscapedata**: Array\\<SARscapeData\\>\n\n   Input file name of the coregistered and geocoded pre-event images. At least one image is required.\n\n- **post_event_file**: SARscapeData\n\n   Input file name of the coregistered and geocoded post-event image. This file is mandatory.\n\n- **land_mask_shape_file**: String\n\n   The algorithm will avoid the areas outside the polygon(s) of the provided shapefile. Note If no mask is loaded, the software will automatically apply mask from the installation folder of SARscape. This mask is derived from OpenStreetMap repository (� OpenStreetMap contributors). These data are licensed under the Open Database License (ODbL). A copy of the modified dataset is available on https//www.openstreetmap.org/. For details, see Copyright and License and Open Data Commons Open Database License (ODbL) � Open Data Commons legal tools for open data and Third-party software and libraries of SARscape .\n\n- **dem_file**: SARscapeData\n\n   Digital Elevation Model file name. This should be referred to the ellipsoid. In case a list of input files is entered, the DEM must cover the whole imaged area.\n\n- **slope_file**: SARscapeData\n\n   Slope file name.\n\n- **output_sarscapedata**: SARscapeData\n\n   _class Classified raster file of the flooded areas. _postEvent Mean amplitude image of the post-event image. _preEvent Mean amplitude image based on the list of pre-event images. _ratio Geocoded ratio (expressed in dB) between the post-event backscatter value and the pre-events backscatter value. _class_filtr Filtered classified raster file of the flooded areas.\n\n- **swl_th**: Double\n\n   This is the minimum dB value that will be used to detect the presence of water, all the pixels under this value will be considered. In case of stable water area between the pre-event image and the post event image, the area will be classified as Persistent Water Area. This parameter is band dependent and it is automatically set from the Flooding Menu inside Preferences Common.\n\n- **dem_th**: Double\n\n   This is the minimum m value that will be used to remove the presence of Stable Water or Flood, all the pixels over this value will be considered.\n\n- **slope_th**: Double\n\n   This is the minimum deg value that will be used to remove the presence of Stable Water or Flood, all the pixels over this value will be considered.\n\n- **ratio_th**: Double\n\n   This is the minimum ratio value between pre-event and post-event image, that will be used to detect the presence of a flooded area. All the pixels over this value will be considered. In case of the presence of water in the area and a sufficient ratio value, the area will be classified as Flooded Area. This parameter is band dependant and it is automatically set from the Flooding Menu inside Preferences Common.\n\n- **high_scatt_point_th**: Double\n\n   This is the backscatter value expressed in decibels relevant to high reflectivity targets, such as ships. This parameter helps avoiding the identification of false positive. Note The side lobes effect may cause the identification of false positive areas surrounding high reflectivity targets.\n\n- **maj_filter_kernel_size**: Double\n\n   This refers to the kernel size of the majority filter used to filter the output classified image.\n\n- **land_mask_buffer_meter**: Double\n\n   Optional buffer area might be defined by a distance around the provided land mask shapefile. A pre-set value  is displayed depending on the input file.\n\n- **opencl_platformid**: String\n\n  Specify the OpenCL platform ID that should be use for parallel computing.\n\n- **opencl_deviceid**: String\n\n  Specify the OpenCL device ID that should be use for parallel computing.\n\n- **generate_ql**: Boolean\n\n  Set this property to True to generate a Quick Look image.\n\n- **in_triggering_execution_option**: String\n\n  Specify a string with the input triggering execution option.\n\n- **out_triggering_execution_option**: String\n\n  Specify a string with the output triggering execution option.\n\n- **root_uri_for_output**: String\n\n  Specify an ENVIURI object with the common URI for all outputs.\n\n- **filtr_sarscapedata**: SARscapeData\n\n  This is a Filtred Classified SARscapeData\n\n- **ratio_sarscapedata**: SARscapeData\n\n  This is a Ratio SARscapeData\n\n- **pre_event_sarscapedata**: SARscapeData\n\n  This is a Pre Event SARscapeData\n\n- **post_event_sarscapedata**: SARscapeData\n\n  This is a Post Event SARscapeData\n\n- **sarscape_preference**: 'Use actual preferences' | 'General' | 'UHR (better than 1m)' | 'VHR (better than 3m)' | 'VHR (better than 6m)' | 'HR (better than 10m)' | 'MR (between 10m and 30m)' | 'LR (coarser than 30m)' | 'Interferometry Low Coherence' | 'Wrong Orbital Data' | 'TanDEM-X Bistatic Configuration' | 'CInSAR ERS-ASAR Interferometry' | 'Sentinel TOPSAR (IW - EW)' | 'PALSAR-2 ScanSAR' | 'TSX ScanSAR' | 'Umbra' | 'Squinted Data'\n\n  Specify a case-sensitive string or integer with the preferred SARScape parameters. The choices are 0 (use actual preferences), 1 (General), 2 (UHR (better than 1m)), 3 (VHR (better than 3m)), 4 (VHR (better than 6m)), 5 (HR (better than 10m)), 6 (MR (between 10m and 30m)), 7 (LR (coarser than 30m)), 8 (Interferometry Low Coherence), 9 (Wrong Orbital Data), 10 (TanDEM-X Bistatic Configuration), 11 (CInSAR ERS-ASAR Interferometry), 12 (Sentinel TOPSAR (IW - EW), 13 (PALSAR-2 ScanSAR), 14 (TSX ScanSAR), 15 (Umbra), and 16 (Squinted Data).\n\n",
          readableName: 'SARscape Process Flooding Classification',
          private: false,
          inherits: ['envitask'],
          docsLookup: {},
          props: {
            flooding_parameters_selection: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'flooding_parameters_selection',
              docs: ' Auto-select from input Parameters will be configured according to the carrier frequency band specified in the SML file. Manual The parameters can be added manually.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized:
                    "'flooding_sml_preferences' | 'flooding_preferences_specific'",
                  args: [],
                  meta: {},
                  value: [
                    'flooding_sml_preferences',
                    'flooding_preferences_specific',
                  ],
                },
              ],
              req: false,
            },
            input_sarscapedata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_sarscapedata',
              docs: ' Input file name of the coregistered and geocoded pre-event images. At least one image is required.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<SARscapeData>',
                  serialized: 'Array<SARscapeData>',
                  args: [
                    [
                      {
                        name: 'SARscapeData',
                        display: 'SARscapeData',
                        serialized: 'SARscapeData',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: true,
            },
            post_event_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'post_event_file',
              docs: ' Input file name of the coregistered and geocoded post-event image. This file is mandatory.',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
            land_mask_shape_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'land_mask_shape_file',
              docs: ' The algorithm will avoid the areas outside the polygon(s) of the provided shapefile. Note If no mask is loaded, the software will automatically apply mask from the installation folder of SARscape. This mask is derived from OpenStreetMap repository (� OpenStreetMap contributors). These data are licensed under the Open Database License (ODbL). A copy of the modified dataset is available on https//www.openstreetmap.org/. For details, see Copyright and License and Open Data Commons Open Database License (ODbL) � Open Data Commons legal tools for open data and Third-party software and libraries of SARscape .',
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
            dem_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'dem_file',
              docs: ' Digital Elevation Model file name. This should be referred to the ellipsoid. In case a list of input files is entered, the DEM must cover the whole imaged area.',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            slope_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'slope_file',
              docs: ' Slope file name.',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            output_sarscapedata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'output_sarscapedata',
              docs: ' _class Classified raster file of the flooded areas. _postEvent Mean amplitude image of the post-event image. _preEvent Mean amplitude image based on the list of pre-event images. _ratio Geocoded ratio (expressed in dB) between the post-event backscatter value and the pre-events backscatter value. _class_filtr Filtered classified raster file of the flooded areas.',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
            swl_th: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'swl_th',
              docs: ' This is the minimum dB value that will be used to detect the presence of water, all the pixels under this value will be considered. In case of stable water area between the pre-event image and the post event image, the area will be classified as Persistent Water Area. This parameter is band dependent and it is automatically set from the Flooding Menu inside Preferences Common.',
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
            dem_th: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'dem_th',
              docs: ' This is the minimum m value that will be used to remove the presence of Stable Water or Flood, all the pixels over this value will be considered.',
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
            slope_th: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'slope_th',
              docs: ' This is the minimum deg value that will be used to remove the presence of Stable Water or Flood, all the pixels over this value will be considered.',
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
            ratio_th: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'ratio_th',
              docs: ' This is the minimum ratio value between pre-event and post-event image, that will be used to detect the presence of a flooded area. All the pixels over this value will be considered. In case of the presence of water in the area and a sufficient ratio value, the area will be classified as Flooded Area. This parameter is band dependant and it is automatically set from the Flooding Menu inside Preferences Common.',
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
            high_scatt_point_th: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'high_scatt_point_th',
              docs: ' This is the backscatter value expressed in decibels relevant to high reflectivity targets, such as ships. This parameter helps avoiding the identification of false positive. Note The side lobes effect may cause the identification of false positive areas surrounding high reflectivity targets.',
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
            maj_filter_kernel_size: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'maj_filter_kernel_size',
              docs: ' This refers to the kernel size of the majority filter used to filter the output classified image.',
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
            land_mask_buffer_meter: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'land_mask_buffer_meter',
              docs: ' Optional buffer area might be defined by a distance around the provided land mask shapefile. A pre-set value  is displayed depending on the input file.',
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
            opencl_platformid: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'opencl_platformid',
              docs: 'Specify the OpenCL platform ID that should be use for parallel computing.',
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
            opencl_deviceid: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'opencl_deviceid',
              docs: 'Specify the OpenCL device ID that should be use for parallel computing.',
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
            generate_ql: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'generate_ql',
              docs: 'Set this property to True to generate a Quick Look image.',
              type: [
                {
                  name: 'Boolean',
                  display: 'Boolean',
                  serialized: 'Boolean',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            in_triggering_execution_option: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'in_triggering_execution_option',
              docs: 'Specify a string with the input triggering execution option.',
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
            out_triggering_execution_option: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'out_triggering_execution_option',
              docs: 'Specify a string with the output triggering execution option.',
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
            root_uri_for_output: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'root_uri_for_output',
              docs: 'Specify an ENVIURI object with the common URI for all outputs.',
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
            filtr_sarscapedata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'filtr_sarscapedata',
              docs: 'This is a Filtred Classified SARscapeData',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            ratio_sarscapedata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'ratio_sarscapedata',
              docs: 'This is a Ratio SARscapeData',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            pre_event_sarscapedata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'pre_event_sarscapedata',
              docs: 'This is a Pre Event SARscapeData',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            post_event_sarscapedata: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'post_event_sarscapedata',
              docs: 'This is a Post Event SARscapeData',
              type: [
                {
                  name: 'SARscapeData',
                  display: 'SARscapeData',
                  serialized: 'SARscapeData',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            sarscape_preference: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'sarscape_preference',
              docs: 'Specify a case-sensitive string or integer with the preferred SARScape parameters. The choices are 0 (use actual preferences), 1 (General), 2 (UHR (better than 1m)), 3 (VHR (better than 3m)), 4 (VHR (better than 6m)), 5 (HR (better than 10m)), 6 (MR (between 10m and 30m)), 7 (LR (coarser than 30m)), 8 (Interferometry Low Coherence), 9 (Wrong Orbital Data), 10 (TanDEM-X Bistatic Configuration), 11 (CInSAR ERS-ASAR Interferometry), 12 (Sentinel TOPSAR (IW - EW), 13 (PALSAR-2 ScanSAR), 14 (TSX ScanSAR), 15 (Umbra), and 16 (Squinted Data).',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized:
                    "'Use actual preferences' | 'General' | 'UHR (better than 1m)' | 'VHR (better than 3m)' | 'VHR (better than 6m)' | 'HR (better than 10m)' | 'MR (between 10m and 30m)' | 'LR (coarser than 30m)' | 'Interferometry Low Coherence' | 'Wrong Orbital Data' | 'TanDEM-X Bistatic Configuration' | 'CInSAR ERS-ASAR Interferometry' | 'Sentinel TOPSAR (IW - EW)' | 'PALSAR-2 ScanSAR' | 'TSX ScanSAR' | 'Umbra' | 'Squinted Data'",
                  args: [],
                  meta: { default: 'Use actual preferences' },
                  value: [
                    'Use actual preferences',
                    'General',
                    'UHR (better than 1m)',
                    'VHR (better than 3m)',
                    'VHR (better than 6m)',
                    'HR (better than 10m)',
                    'MR (between 10m and 30m)',
                    'LR (coarser than 30m)',
                    'Interferometry Low Coherence',
                    'Wrong Orbital Data',
                    'TanDEM-X Bistatic Configuration',
                    'CInSAR ERS-ASAR Interferometry',
                    'Sentinel TOPSAR (IW - EW)',
                    'PALSAR-2 ScanSAR',
                    'TSX ScanSAR',
                    'Umbra',
                    'Squinted Data',
                  ],
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
