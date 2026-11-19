import { z } from 'zod';

export const IDLTaskParameter_1_0 = z
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
          'Optionally specify the keyword name for "routine" if the keyword does not match "name".',
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
      title: 'Type',
      description:
        'A scalar string indicating the parameter type to use on creating an instance of the task.\n\nBasic scalar data type string values are:\n\n- BYTE, INT, UINT, LONG, ULONG, LONG64,ULONG64, FLOAT, DOUBLE, COMPLEX, DCOMPLEX, STRING, BOOLEAN, LIST, HASH, DICTIONARY, ORDEREDHASH\n\nBasic array data types must include the dimensions key and type string values are:\n\n- BYTEARRAY, INTARRAY, UINTARRAY, LONGARRAY, ULONGARRAY, LONG64ARRAY,ULONG64ARRAY, FLOATARRAY, DOUBLEARRAY, COMPLEXARRAY, DCOMPLEXARRAY, STRINGARRAY, BOOLEANARRAY\n\nThe type key value can be set to a class name to indicate that the user must provide an object of the given class name.',
    }),
    dimensions: z
      .string()
      .meta({
        title: 'Dimensions',
        description:
          'Specify the array dimensions if the type parameter is an array.\n\nExample of a three-element array declaration:\n    "type": "floatArray",\n    "dimensions": "[3]"\nExample of a 1D array with any number of elements:\n    "type": "intArray",\n    "dimensions": "[*]"\nExample of a 2D array with any number of columns or rows:\n    "type": "intArray",\n    "dimensions": "[*,*]"\nExample of a 2D array with a specific number of elements:\n    "type": "byteArray",\n    "dimensions": "[3,256]"\nExample of a 2D array with any number of columns and 3 rows:\n    "type": "intArray",\n    "dimensions": "[*,3]"\n',
      })
      .optional(),
    direction: z.enum(['input', 'output', 'INPUT', 'OUTPUT']).meta({
      title: 'Direction',
      description:
        'Specify if the parameter is "input" or "output".\n\nNote: If you are using an older version of ENVI where the task template specifies the version key (instead of schema), be aware of the differences in output behavior: ENVI automatically creates an OUTPUT_RASTER_URI property if you define the OUTPUT_RASTER property of an ENVIRaster and you set the direction parameter to output.',
    }),
    description: z
      .string()
      .meta({
        title: 'Description',
        description: 'A description of the parameter.',
      })
      .optional(),
    required: z.boolean().meta({
      title: 'Required',
      description:
        'Set this parameter to true if this parameter is needed to execute or not.',
      default: true,
    }),
    choice_list: z
      .unknown()
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
  .meta({ id: 'idltask-1.0-parameter' });

export const IDLTask_1_0 = z
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
    parameters: z.array(IDLTaskParameter_1_0).meta({
      title: 'Parameters',
      description: 'A array of objects with key/value pairs.',
    }),
  })
  .meta({ id: 'idltask-1.0-task' });

export const IDLTask_1_1 = z
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
    }),
    IDLTask_1_0,
  )
  .meta({ id: 'idltask-1.1-task' });

export const IDLTask_1_2 = z
  .intersection(
    z.object({
      tags: z
        .array(z.string())
        .meta({
          description: 'An array of strings that help categorize the task.',
        })
        .optional(),
    }),
    IDLTask_1_1,
  )
  .meta({ id: 'idltask-1.2-task' });
