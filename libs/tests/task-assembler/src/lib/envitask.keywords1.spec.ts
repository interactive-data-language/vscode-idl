import { TaskAssembler } from '@idl/assembler';
import { LoadTask } from '@idl/schemas/tasks';

describe(`[auto generated] Verify keyword formatting for ENVITasks`, () => {
  it(`[auto generated] upper case`, async () => {
    // test code to extract tokens from
    const code = [
      `{`,
      `  "name": "ATAnomalyDetection",`,
      `  "schema": "envitask_3.3",`,
      `  "base_class": "ENVITaskFromProcedure",`,
      `  "routine": "atAnomalyDetection",`,
      `  "display_name": "AT Anomaly Detection",`,
      `  "description": "Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.",`,
      `  "parameters": [`,
      `    {`,
      `      "keyword": "input_raster",`,
      `      "name": "input_raster",`,
      `      "display_name": "Input Raster",`,
      `      "description": "The raster to run anomaly detection on.",`,
      `      "direction": "input",`,
      `      "required": true,`,
      `      "hidden": false,`,
      `      "type": "ENVIRaster"`,
      `    },`,
      `    {`,
      `      "keyword": "output_raster_uri",`,
      `      "name": "output_raster_uri",`,
      `      "display_name": "Output Raster URI",`,
      `      "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.",`,
      `      "direction": "input",`,
      `      "required": false,`,
      `      "hidden": false,`,
      `      "type": "ENVIURI",`,
      `      "auto_extension": ".dat"`,
      `    },`,
      `    {`,
      `      "keyword": "output_raster",`,
      `      "name": "output_raster",`,
      `      "display_name": "Output Raster",`,
      `      "description": "This is a reference to an ENVIRaster object.",`,
      `      "direction": "output",`,
      `      "required": true,`,
      `      "hidden": false,`,
      `      "type": "ENVIRaster",`,
      `      "uri_param": "OUTPUT_RASTER_URI"`,
      `    }`,
      `  ]`,
      `}`,
    ];

    // extract tokens
    const parsed = await LoadTask('my_file.task', code.join(''));

    // format code
    const formatted = TaskAssembler(parsed, {
      style: { keywords: 'upper' },
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
        `  "schema": "envitask_3.3",`,
        `  "name": "ATAnomalyDetection",`,
        `  "display_name": "AT Anomaly Detection",`,
        `  "description": "Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.",`,
        `  "base_class": "ENVITaskFromProcedure",`,
        `  "routine": "atAnomalyDetection",`,
        `  "parameters": [`,
        `    {`,
        `      "name": "INPUT_RASTER",`,
        `      "display_name": "Input Raster",`,
        `      "keyword": "INPUT_RASTER",`,
        `      "description": "The raster to run anomaly detection on.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "hidden": false,`,
        `      "type": "ENVIRaster"`,
        `    },`,
        `    {`,
        `      "name": "OUTPUT_RASTER_URI",`,
        `      "display_name": "Output Raster URI",`,
        `      "keyword": "OUTPUT_RASTER_URI",`,
        `      "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.",`,
        `      "direction": "input",`,
        `      "required": false,`,
        `      "hidden": false,`,
        `      "type": "ENVIURI",`,
        `      "auto_extension": ".dat"`,
        `    },`,
        `    {`,
        `      "name": "OUTPUT_RASTER",`,
        `      "display_name": "Output Raster",`,
        `      "keyword": "OUTPUT_RASTER",`,
        `      "description": "This is a reference to an ENVIRaster object.",`,
        `      "direction": "output",`,
        `      "required": true,`,
        `      "hidden": false,`,
        `      "type": "ENVIRaster",`,
        `      "uri_param": "OUTPUT_RASTER_URI"`,
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
      `  "name": "ATAnomalyDetection",`,
      `  "schema": "envitask_3.3",`,
      `  "base_class": "ENVITaskFromProcedure",`,
      `  "routine": "atAnomalyDetection",`,
      `  "display_name": "AT Anomaly Detection",`,
      `  "description": "Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.",`,
      `  "parameters": [`,
      `    {`,
      `      "keyword": "INPUT_RASTER",`,
      `      "name": "input_raster",`,
      `      "display_name": "Input Raster",`,
      `      "description": "The raster to run anomaly detection on.",`,
      `      "direction": "input",`,
      `      "required": true,`,
      `      "hidden": false,`,
      `      "type": "ENVIRaster"`,
      `    },`,
      `    {`,
      `      "keyword": "OUTPUT_RASTER_URI",`,
      `      "name": "output_raster_uri",`,
      `      "display_name": "Output Raster URI",`,
      `      "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.",`,
      `      "direction": "input",`,
      `      "required": false,`,
      `      "hidden": false,`,
      `      "type": "ENVIURI",`,
      `      "auto_extension": ".dat"`,
      `    },`,
      `    {`,
      `      "keyword": "OUTPUT_RASTER",`,
      `      "name": "output_raster",`,
      `      "display_name": "Output Raster",`,
      `      "description": "This is a reference to an ENVIRaster object.",`,
      `      "direction": "output",`,
      `      "required": true,`,
      `      "hidden": false,`,
      `      "type": "ENVIRaster",`,
      `      "uri_param": "OUTPUT_RASTER_URI"`,
      `    }`,
      `  ]`,
      `}`,
    ];

    // extract tokens
    const parsed = await LoadTask('my_file.task', code.join(''));

    // format code
    const formatted = TaskAssembler(parsed, {
      style: { keywords: 'lower' },
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
        `  "schema": "envitask_3.3",`,
        `  "name": "ATAnomalyDetection",`,
        `  "display_name": "AT Anomaly Detection",`,
        `  "description": "Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.",`,
        `  "base_class": "ENVITaskFromProcedure",`,
        `  "routine": "atAnomalyDetection",`,
        `  "parameters": [`,
        `    {`,
        `      "name": "input_raster",`,
        `      "display_name": "Input Raster",`,
        `      "keyword": "input_raster",`,
        `      "description": "The raster to run anomaly detection on.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "hidden": false,`,
        `      "type": "ENVIRaster"`,
        `    },`,
        `    {`,
        `      "name": "output_raster_uri",`,
        `      "display_name": "Output Raster URI",`,
        `      "keyword": "output_raster_uri",`,
        `      "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.",`,
        `      "direction": "input",`,
        `      "required": false,`,
        `      "hidden": false,`,
        `      "type": "ENVIURI",`,
        `      "auto_extension": ".dat"`,
        `    },`,
        `    {`,
        `      "name": "output_raster",`,
        `      "display_name": "Output Raster",`,
        `      "keyword": "output_raster",`,
        `      "description": "This is a reference to an ENVIRaster object.",`,
        `      "direction": "output",`,
        `      "required": true,`,
        `      "hidden": false,`,
        `      "type": "ENVIRaster",`,
        `      "uri_param": "OUTPUT_RASTER_URI"`,
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
      `  "name": "ATAnomalyDetection",`,
      `  "schema": "envitask_3.3",`,
      `  "base_class": "ENVITaskFromProcedure",`,
      `  "routine": "atAnomalyDetection",`,
      `  "display_name": "AT Anomaly Detection",`,
      `  "description": "Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.",`,
      `  "parameters": [`,
      `    {`,
      `      "keyword": "INPUT_RASTER",`,
      `      "name": "input_raster",`,
      `      "display_name": "Input Raster",`,
      `      "description": "The raster to run anomaly detection on.",`,
      `      "direction": "input",`,
      `      "required": true,`,
      `      "hidden": false,`,
      `      "type": "ENVIRaster"`,
      `    },`,
      `    {`,
      `      "keyword": "output_RASTER_uri",`,
      `      "name": "output_raster_uri",`,
      `      "display_name": "Output Raster URI",`,
      `      "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.",`,
      `      "direction": "input",`,
      `      "required": false,`,
      `      "hidden": false,`,
      `      "type": "ENVIURI",`,
      `      "auto_extension": ".dat"`,
      `    },`,
      `    {`,
      `      "keyword": "OUTPUT_RASTER",`,
      `      "name": "output_raster",`,
      `      "display_name": "Output Raster",`,
      `      "description": "This is a reference to an ENVIRaster object.",`,
      `      "direction": "output",`,
      `      "required": true,`,
      `      "hidden": false,`,
      `      "type": "ENVIRaster",`,
      `      "uri_param": "OUTPUT_RASTER_URI"`,
      `    }`,
      `  ]`,
      `}`,
    ];

    // extract tokens
    const parsed = await LoadTask('my_file.task', code.join(''));

    // format code
    const formatted = TaskAssembler(parsed, {
      style: { keywords: 'none' },
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
        `  "schema": "envitask_3.3",`,
        `  "name": "ATAnomalyDetection",`,
        `  "display_name": "AT Anomaly Detection",`,
        `  "description": "Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.",`,
        `  "base_class": "ENVITaskFromProcedure",`,
        `  "routine": "atAnomalyDetection",`,
        `  "parameters": [`,
        `    {`,
        `      "name": "input_raster",`,
        `      "display_name": "Input Raster",`,
        `      "keyword": "INPUT_RASTER",`,
        `      "description": "The raster to run anomaly detection on.",`,
        `      "direction": "input",`,
        `      "required": true,`,
        `      "hidden": false,`,
        `      "type": "ENVIRaster"`,
        `    },`,
        `    {`,
        `      "name": "output_raster_uri",`,
        `      "display_name": "Output Raster URI",`,
        `      "keyword": "output_RASTER_uri",`,
        `      "description": "Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.",`,
        `      "direction": "input",`,
        `      "required": false,`,
        `      "hidden": false,`,
        `      "type": "ENVIURI",`,
        `      "auto_extension": ".dat"`,
        `    },`,
        `    {`,
        `      "name": "output_raster",`,
        `      "display_name": "Output Raster",`,
        `      "keyword": "OUTPUT_RASTER",`,
        `      "description": "This is a reference to an ENVIRaster object.",`,
        `      "direction": "output",`,
        `      "required": true,`,
        `      "hidden": false,`,
        `      "type": "ENVIRaster",`,
        `      "uri_param": "OUTPUT_RASTER_URI"`,
        `    }`,
        `  ]`,
        `}`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);
    }
  });
});
