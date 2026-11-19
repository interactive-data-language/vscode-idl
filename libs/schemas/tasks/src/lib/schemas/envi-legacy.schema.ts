import { z } from 'zod';

export const ENVILegacyTaskParameter_5_2_1 = z
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
    displayName: z
      .string()
      .meta({
        title: 'Display Name',
        description:
          'The name of the task as it appears to the end user. This key is used by tasks that display a dynamic user interface for entering parameters.',
      })
      .optional(),
    dataType: z.string().meta({
      title: 'Data Type',
      description:
        'A scalar string with one of the following:\n- IDL data type: Byte, Int, Long, Float, Double, Complex, String, DComplex, UInt, ULong, Long64, or ULong64\n- The required class for the parameter (for example ENVIRaster)\n- Boolean type (Bool)\n- ENVIURI: Indicates that a string is required that references a local or remote file source.\n\nIf the parameter requires an array, the string contains additional information on array dimensions.\n\n- Example of a three-element array declaration: FLOAT[3]\n- Example of a 1D array with any number of elements: INT[*]\n- Example of a 2D array with any number of columns or rows: INT[*,*]\n- Example of a 2D array with a specific number of elements: BYTE[3,256]\n- Example of a 2D array with any number of columns and 3 rows: INT[*,3]',
    }),
    direction: z.enum(['input', 'output', 'INPUT', 'OUTPUT']).meta({
      title: 'Direction',
      description: 'Specify if the parameter is "input" or "output".',
    }),
    description: z.string().meta({
      title: 'Description',
      description: 'A description of the parameter.',
    }),
    parameterType: z
      .enum(['required', 'optional', 'REQUIRED', 'OPTIONAL'])
      .meta({
        title: 'Parameter Type',
        description:
          'Specify if the parameter is "required" or "optional" (default) in order for the task to execute.',
      }),
    choiceList: z
      .xor([z.record(z.string(), z.unknown()), z.array(z.unknown())])
      .meta({
        title: 'Choice List',
        description:
          'A string array that lists the possible values for the property. Any IDL data type is supported. You can also map from user-friendly strings to an internal lookup table of values if desired.',
      })
      .optional(),
    defaultValue: z
      .unknown()
      .meta({
        title: 'Default Value',
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
  .meta({ id: 'envi-5.2.1-parameter' });

export const ENVILegacyTaskParameter_5_3 = z
  .intersection(
    z.object({
      dataType: z
        .string()
        .meta({
          title: 'Data Type',
          description:
            'A scalar string with one of the following:\n- IDL data type: Byte, Int, Long, Float, Double, Complex, String, DComplex, UInt, ULong, Long64, or ULong64\n- The required class for the parameter (for example, ENVIRaster, ENVIVector, or ENVIROI)\n- Boolean type (Bool)\n- ENVIURI: Indicates that a string is required that references a local or remote file source.\n\nIf the parameter requires an array, the string contains additional information on array dimensions.\n\n- Example of a three-element array declaration: FLOAT[3]\n- Example of a 1D array with any number of elements: INT[*]\n- Example of a 2D array with any number of columns or rows: INT[*,*]\n- Example of a 2D array with a specific number of elements: BYTE[3,256]\n- Example of a 2D array with any number of columns and 3 rows: INT[*,3]',
        })
        .optional(),
    }),
    ENVILegacyTaskParameter_5_2_1,
  )
  .meta({ id: 'envi-5.3-parameter' });

export const ENVILegacyTask_5_2_1 = z
  .object({
    name: z.string().meta({
      title: 'Name',
      description:
        'A string with the name of the task, excluding the prefix ENVI and the suffix Task.',
    }),
    baseClass: z.string().meta({
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
    displayName: z
      .string()
      .meta({
        title: 'Display name',
        description:
          'A string with the name of the task as it appears to the end user. Spaces and special characters are allowed.',
      })
      .optional(),
    description: z.string().meta({
      title: 'Description',
      description: 'A string with a description of the task.',
    }),
    version: z.string().meta({
      title: 'Version - Deprecated',
      description:
        'A string listing the earliest version of ENVI that the task will work with. The "schema" tag is preferred as it is the newer task schema to work with.\nThe valid values are "5.3.2", "5.3.1", "5.3", and "5.2.1"',
      deprecated: true,
    }),
    parameters: z.array(ENVILegacyTaskParameter_5_2_1).meta({
      title: 'Parameters',
      description: 'A array of objects with key/value pairs.',
    }),
  })
  .meta({ id: 'envi-5.2.1-task' });

export const ENVILegacyTask_5_3 = z
  .intersection(
    z.object({
      parameters: z
        .array(ENVILegacyTaskParameter_5_3)
        .meta({
          title: 'Parameters',
          description: 'A array of objects with key/value pairs.',
        })
        .optional(),
    }),
    ENVILegacyTask_5_2_1,
  )
  .meta({ id: 'envi-5.3-task' });
