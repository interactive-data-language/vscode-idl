import { TaskAssembler } from '@idl/assembler';
import { LoadTask } from '@idl/schemas/tasks';

describe(`[auto generated] Verify parameter formatting for IDL Tasks`, () => {
  it(`[auto generated] upper case`, async () => {
    // test code to extract tokens from
    const code = [
      `{`,
      `  "name": "Download_S3_URL",`,
      `  "base_class": "IDLTaskFromProcedure",`,
      `  "routine": "download_S3_URL",`,
      `  "display_name": "Download S3 URL",`,
      `  "description": "This task downloads a resource specified by an S3 URL into a local file.",`,
      `  "revision": "1.0.0",`,
      `  "schema": "idltask_1.1",`,
      `  "parameters": [`,
      `    {`,
      `      "name": "s3_url",`,
      `      "display_name": "S3 URL",`,
      `      "type": "String",`,
      `      "direction": "INPUT",`,
      `      "required": true,`,
      `      "description": "The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme."`,
      `    },`,
      `    {`,
      `      "name": "local_file",`,
      `      "display_name": "Local Filename",`,
      `      "type": "String",`,
      `      "direction": "INPUT",`,
      `      "required": true,`,
      `      "description": "The local file in which to download the S3 resource."`,
      `    }`,
      `  ]`,
      `}`,
    ];

    // extract tokens
    const parsed = await LoadTask('my_file.task', code.join(''));

    // format code
    const formatted = TaskAssembler(parsed, {
      style: { properties: 'upper' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `{`,
        `  "schema": "idltask_1.1",`,
        `  "name": "Download_S3_URL",`,
        `  "display_name": "Download S3 URL",`,
        `  "revision": "1.0.0",`,
        `  "description": "This task downloads a resource specified by an S3 URL into a local file.",`,
        `  "base_class": "IDLTaskFromProcedure",`,
        `  "routine": "download_S3_URL",`,
        `  "parameters": [`,
        `    {`,
        `      "name": "s3_url",`,
        `      "display_name": "S3 URL",`,
        `      "description": "The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "type": "String"`,
        `    },`,
        `    {`,
        `      "name": "local_file",`,
        `      "display_name": "Local Filename",`,
        `      "description": "The local file in which to download the S3 resource.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "type": "String"`,
        `    }`,
        `  ]`,
        `}`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);
    }
  });

  it(`[auto generated] lower`, async () => {
    // test code to extract tokens from
    const code = [
      `{`,
      `  "name": "Download_S3_URL",`,
      `  "base_class": "IDLTaskFromProcedure",`,
      `  "routine": "download_S3_URL",`,
      `  "display_name": "Download S3 URL",`,
      `  "description": "This task downloads a resource specified by an S3 URL into a local file.",`,
      `  "revision": "1.0.0",`,
      `  "schema": "idltask_1.1",`,
      `  "parameters": [`,
      `    {`,
      `      "name": "S3_URL",`,
      `      "display_name": "S3 URL",`,
      `      "type": "String",`,
      `      "direction": "INPUT",`,
      `      "required": true,`,
      `      "description": "The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme."`,
      `    },`,
      `    {`,
      `      "name": "LOCAL_FILE",`,
      `      "display_name": "Local Filename",`,
      `      "type": "String",`,
      `      "direction": "INPUT",`,
      `      "required": true,`,
      `      "description": "The local file in which to download the S3 resource."`,
      `    }`,
      `  ]`,
      `}`,
    ];

    // extract tokens
    const parsed = await LoadTask('my_file.task', code.join(''));

    // format code
    const formatted = TaskAssembler(parsed, {
      style: { properties: 'lower' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `{`,
        `  "schema": "idltask_1.1",`,
        `  "name": "Download_S3_URL",`,
        `  "display_name": "Download S3 URL",`,
        `  "revision": "1.0.0",`,
        `  "description": "This task downloads a resource specified by an S3 URL into a local file.",`,
        `  "base_class": "IDLTaskFromProcedure",`,
        `  "routine": "download_S3_URL",`,
        `  "parameters": [`,
        `    {`,
        `      "name": "s3_url",`,
        `      "display_name": "S3 URL",`,
        `      "description": "The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "type": "String"`,
        `    },`,
        `    {`,
        `      "name": "local_file",`,
        `      "display_name": "Local Filename",`,
        `      "description": "The local file in which to download the S3 resource.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "type": "String"`,
        `    }`,
        `  ]`,
        `}`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);
    }
  });

  it(`[auto generated] ignore`, async () => {
    // test code to extract tokens from
    const code = [
      `{`,
      `  "name": "Download_S3_URL",`,
      `  "base_class": "IDLTaskFromProcedure",`,
      `  "routine": "download_S3_URL",`,
      `  "display_name": "Download S3 URL",`,
      `  "description": "This task downloads a resource specified by an S3 URL into a local file.",`,
      `  "revision": "1.0.0",`,
      `  "schema": "idltask_1.1",`,
      `  "parameters": [`,
      `    {`,
      `      "name": "S3_URL",`,
      `      "display_name": "S3 URL",`,
      `      "type": "String",`,
      `      "direction": "INPUT",`,
      `      "required": true,`,
      `      "description": "The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme."`,
      `    },`,
      `    {`,
      `      "name": "local_file",`,
      `      "display_name": "Local Filename",`,
      `      "type": "String",`,
      `      "direction": "INPUT",`,
      `      "required": true,`,
      `      "description": "The local file in which to download the S3 resource."`,
      `    }`,
      `  ]`,
      `}`,
    ];

    // extract tokens
    const parsed = await LoadTask('my_file.task', code.join(''));

    // format code
    const formatted = TaskAssembler(parsed, {
      style: { properties: 'none' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `{`,
        `  "schema": "idltask_1.1",`,
        `  "name": "Download_S3_URL",`,
        `  "display_name": "Download S3 URL",`,
        `  "revision": "1.0.0",`,
        `  "description": "This task downloads a resource specified by an S3 URL into a local file.",`,
        `  "base_class": "IDLTaskFromProcedure",`,
        `  "routine": "download_S3_URL",`,
        `  "parameters": [`,
        `    {`,
        `      "name": "s3_url",`,
        `      "display_name": "S3 URL",`,
        `      "description": "The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "type": "String"`,
        `    },`,
        `    {`,
        `      "name": "local_file",`,
        `      "display_name": "Local Filename",`,
        `      "description": "The local file in which to download the S3 resource.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "type": "String"`,
        `    }`,
        `  ]`,
        `}`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);
    }
  });
});
