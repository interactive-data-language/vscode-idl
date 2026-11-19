import { z } from 'zod';

/** Tasks with a base class ending in "procedure" must specify a routine */
const ROUTINE_REQUIRED_REGEX = /[Pp][Rr][Oo][Cc][Ee][Dd][Uu][Rr][Ee]$/;

export const ENVITaskParameter_3_0 = z
  .object({
    name: z.string().meta({
      title: 'Name',
      description:
        'The name of the parameter as it appears to the end user. If "keyword" is not set, then it is assumed that our "routine" has a keyword with the same name as this property.',
    }),
    keyword: z
      .string()
      .meta({
        title: 'Keyword',
        description:
          'Optionally specify the keyword name for "routine" if the keyword doe snot match "name".',
      })
      .optional(),
    display_name: z
      .string()
      .meta({
        title: 'Display Name',
        description:
          'The name of the task as it appears to the end user. This key is used by tasks that display a dynamic user interface for entering parameters.',
      })
      .optional(),
    type: z.string().meta({
      title: 'Data Type',
      description:
        'A scalar string with one of the following:\n- IDL data type: Byte, Int, Long, Float, Double, Complex, String, DComplex, UInt, ULong, Long64, or ULong64\n- The required class for the parameter (for example, ENVIRaster, ENVIVector, or ENVIROI)\n- Boolean type (Bool)\n- ENVIURI: Indicates that a string is required that references a local or remote file source.\n- List (scalar only; no arrays)\n- OrderedList (scalar only; no arrays)\n- Hash (scalar only; no arrays)\n- OrderedHash (scalar only; no arrays)\n\nIf a specified data type requires more than one scalar, use the dimensions parameter below to indicate the array dimensions. Append Array to the data type; for example, floatArray.',
    }),
    dimensions: z
      .xor([z.string(), z.array(z.number())])
      .meta({
        title: 'Dimensions',
        description:
          'Specify the array dimensions if the type parameter is an array.\n\nExample of a three-element array declaration:\n    "type": "floatArray",\n    "dimensions": "[3]"\nExample of a 1D array with any number of elements:\n    "type": "intArray",\n    "dimensions": "[*]"\nExample of a 2D array with any number of columns or rows:\n    "type": "intArray",\n    "dimensions": "[*,*]"\nExample of a 2D array with a specific number of elements:\n    "type": "byteArray",\n    "dimensions": "[3,256]"\nExample of a 2D array with any number of columns and 3 rows:\n    "type": "intArray",\n    "dimensions": "[*,3]"\n',
      })
      .optional(),
    direction: z
      .enum(['input', 'output', 'INPUT', 'OUTPUT'])
      .meta({
        title: 'Direction',
        description:
          'Specify if the parameter is "input" or "output". Defaults to "input".\n\nNote: If you are using an older version of ENVI where the task template specifies the version key (instead of schema), be aware of the differences in output behavior: ENVI automatically creates an OUTPUT_RASTER_URI property if you define the OUTPUT_RASTER property of an ENVIRaster and you set the direction parameter to output.',
      })
      .optional(),
    description: z
      .string()
      .meta({
        title: 'Description',
        description: 'A description of the parameter.',
      })
      .optional(),
    required: z
      .boolean()
      .meta({
        title: 'Required',
        description:
          'Set this parameter to true if this parameter is needed to execute or not.',
        default: true,
      })
      .optional(),
    choice_list: z
      .xor([z.record(z.string(), z.unknown()), z.array(z.unknown())])
      .meta({
        title: 'Choice List',
        description:
          'A string array that lists the possible values for the property. Any IDL data type is supported. You can also map from user-friendly strings to an internal lookup table of values if desired.',
      })
      .optional(),
    default: z
      .unknown()
      .meta({
        title: 'Default',
        description:
          'The default value of the parameter if the end user does not provide a value.',
      })
      .optional(),
    min: z
      .unknown()
      .meta({
        title: 'Min',
        description:
          'A value that is greater than or equal to the minimum value allowed for the parameter.',
      })
      .optional(),
    max: z
      .unknown()
      .meta({
        title: 'Max',
        description:
          'A value that is less than or equal to the maximum value allowed for the parameter.',
      })
      .optional(),
    hidden: z
      .boolean()
      .meta({
        title: 'Hidden',
        description:
          'Set this key to true if the parameter is required for the task but you do not want to expose it to the end user. You must also set the defaultValue key to the desired value for the parameter to be set internally.',
        default: false,
      })
      .optional(),
  })
  .meta({ id: 'envitask-3.0-parameter' });

export const ENVITaskParameter_3_1 = z
  .intersection(
    z.object({
      auto_extension: z
        .string()
        .meta({
          title: 'Auto Extension',
          description:
            'This property only applies when:\n\n- The type key is set to ENVIURI or ENVIURIArray, and:\n- The direction key is set to input\n\nSet this property to a scalar string to use as a file extension for input ENVIURI parameters where VALUE=!NULL. When the parent ENVITask is executed, input ENVIURI parameters without a value can be populated by values generated by ENVI::GetTemporaryFilename. If this property is not set, or if it is set to !NULL, then no filenames will be generated and the task will likely fail. An empty string value will generate filenames without an extension.',
        })
        .optional(),
      is_temporary: z
        .boolean()
        .meta({
          title: 'Is Temporary',
          description:
            'This property only applies when:\n\n- The type key is set to ENVIURI or ENVIURIArray, and\n- The direction key is set to input, and\n- The auto_extension key is not !NULL\n\nSet this property to true to indicate if input ENVIURI parameters with filenames automatically generated by the ENVITask framework will be deleted when ENVI closes.\n\nWhen the parent ENVITask is executed, input ENVIURI parameters that had VALUE=!NULL and had their values populated according to the auto_extension property can be marked for deletion when ENVI closes.',
        })
        .optional(),
      is_directory: z
        .boolean()
        .meta({
          title: 'Is Directory',
          description:
            "Set this property to true to indicate if the VALUE of an ENVIURI parameter should be treated as a directory or a URI to a file. When the parent ENVITask is executed and the VALUE property is set to !NULL and the is_directory key is set to true, then a subdirectory will be created under the ENVI Output Directory preference location. The base name will consist of the parameter's NAME, and the parameter's VALUE will be set to that new directory.",
        })
        .optional(),
      uri_param: z
        .string()
        .meta({
          title: 'URI Param',
          description:
            'This property only applies when:\n- The type key is set to a supported scalar or array data type that has an associated URI-based ENVIParameter* class. This includes ENVIConfusionMatrix, ENVIExamples, ENVIGCPSet, ENVIPointCloud (scalar only), ENVIPointCloudQuery (scalar only), ENVIRaster, ENVIRasterSeries, ENVIROI, ENVISpectralLibrary, ENVITiePointSet, and ENVIVector.\n- The direction key is set to output.\n\nSet this key to a parameter name (in the same task) that it is associated with. That other parameter must adhere to the following constraints:\n- The type key is set to ENVIURI if the parameter is a scalar type, or ENVIURIArray if the parameter is an array type.\n- The dimensions key must match the parameter\'s dimension key if this is an array type.\n- The direction key is set to input.\n\nFor example, the uri_param key for OUTPUT_RASTER below is set to OUTPUT_URI, which is the name of the associated input parameter of type ENVIURI. That input parameter specifies what file to use to export the raster.\n\n{\n  "name": "OUTPUT_RASTER",\n  "display_name": "Output Raster",\n  "type": "ENVIRASTER",\n  "direction": "output",\n  "required": true,\n  "uri_param": "OUTPUT_URI",\n  "description": "This is a reference to the output raster."\n},\n{\n  "name": "OUTPUT_URI",\n  "display_name": "Output Raster URI",\n  "type": "ENVIURI",\n  "direction": "input",\n  "required": false,\n  "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER."\n  "fold_case": true,\n  "auto_extension": ".dat",\n  "is_temporary": true\n}',
        })
        .optional(),
    }),
    ENVITaskParameter_3_0,
  )
  .meta({ id: 'envitask-3.1-parameter' });

export const ENVITask_3_0 = z
  .object({
    name: z.string().meta({
      title: 'Name',
      description:
        'A string with the name of the task, excluding the prefix ENVI and the suffix Task.',
    }),
    base_class: z.string().meta({
      title: 'Base Class',
      description:
        'A string with the name of the class to use - this should be set to "ENVITaskFromProcedure".',
      default: 'ENVITaskFromProcedure',
    }),
    routine: z
      .string()
      .meta({
        title: 'Routine',
        description:
          'The name of the IDL procedure that is called when Task.Execute is invoked.',
      })
      .optional(),
    display_name: z
      .string()
      .meta({
        title: 'Display name',
        description:
          'A string with the name of the task as it appears to the end user. Spaces and special characters are allowed.',
      })
      .optional(),
    description: z
      .string()
      .meta({
        title: 'Description',
        description: 'A string with a description of the task.',
      })
      .optional(),
    schema: z.string().meta({
      title: 'Schema',
      description:
        'A string listing the version of ENVITask JSON schema that was used to write this task.\nThe valid values are "envitask_3.3" "envitask_3.2", "envitask_3.1" or "envitask_3.0".',
    }),
    tags: z
      .array(z.string())
      .meta({
        title: 'Tags',
        description:
          'An array of tags that represents the categories a task is for.',
      })
      .optional(),
    parameters: z.array(ENVITaskParameter_3_0).meta({
      title: 'Parameters',
      description: 'A array of objects with key/value pairs.',
    }),
  })
  .refine(
    (task) =>
      !ROUTINE_REQUIRED_REGEX.test(String(task.base_class)) ||
      task.routine !== undefined,
    {
      error: 'Property "routine" is required for procedure-based tasks',
      path: ['routine'],
    },
  )
  .meta({
    id: 'envitask-3.0-task',
    if: {
      properties: {
        base_class: { type: 'string', pattern: ROUTINE_REQUIRED_REGEX.source },
      },
    },
    then: { required: ['routine'] },
  });

export const ENVITask_3_1 = z
  .intersection(
    z.object({
      revision: z
        .string()
        .meta({
          title: 'Revision',
          description:
            'A string with the semantic revision number of the task. Semantic versioning provides a quick way to extract information about a new task release using a convention of X.Y.Z, where:\n\n- X represents the major version. An incremented value indicates that task additions and updates are not backward-compatible.\n- Y represents the minor version. An incremented value indicates that task additions and updates are backward-compatible.\n- Z represents the patch number. An incremented value indicates bug fixes that do not affect the task.\n\nThe revision key is for development purposes only. The revision number does not affect which task file is loaded. Whichever task file is found first will be used. If revision is not set, it will default to a value of 1.0.0.',
          default: '1.0.0',
        })
        .optional(),
      parameters: z
        .array(ENVITaskParameter_3_1)
        .meta({
          title: 'Parameters',
          description: 'A array of objects with key/value pairs.',
        })
        .optional(),
    }),
    ENVITask_3_0,
  )
  .meta({ id: 'envitask-3.1-task' });

export const ENVITask_3_2 = z
  .intersection(
    z.object({
      tags: z
        .array(z.string())
        .meta({
          description: 'An array of strings that help categorize the task.',
        })
        .optional(),
    }),
    ENVITask_3_1,
  )
  .meta({ id: 'envitask-3.2-task' });
