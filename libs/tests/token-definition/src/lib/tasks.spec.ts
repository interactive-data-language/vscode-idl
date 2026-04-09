import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find definitions for task files`, () => {
  it(`[auto generated] from ENVITask function`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/token-def/tasks.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/tasks.pro'));

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/token-def/atanomalydetection.task'),
    );

    // define position
    const position_0: Position = { line: 2, character: 12 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'f',
      name: 'enviatanomalydetectiontask',
      pos: [0, 0, 0],
      meta: {
        display: 'ENVIATAnomalyDetectionTask',
        source: 'user',
        docs: "\nRuns an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.\n\n### Syntax\n\n```idl\n;+\n; :Returns: ENVITask<ATAnomalyDetection>\n;-\nmyTask = ENVITask('ATAnomalyDetection')\n\n; set input parameters\nmyTask.input_raster = value\nmyTask.output_raster_uri = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\noutput_raster = myTask.output_raster\n\n```\n\n\n### Input Parameters\n\n- **input_raster**: ENVIRaster\n\n  The raster to run anomaly detection on.\n\n- **output_raster_uri**: String\n\n  Specify a string with the fully-qualified path and filename for OUTPUT_RASTER.\n\n\n\n### Output Parameters\n\n- **output_raster**: ENVIRaster\n\n  This is a reference to an ENVIRaster object.\n\n",
        private: false,
        returns: [
          {
            name: 'enviatanomalydetectiontask',
            display: 'ENVITask<atanomalydetection>',
            serialized: 'ENVITask<atanomalydetection>',
            args: [
              [
                {
                  name: 'atanomalydetection',
                  display: 'atanomalydetection',
                  serialized: 'atanomalydetection',
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
    };

    // get expected and remove file
    const found_0 = await index.getTokenDef(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0,
    );
    if (found_0 !== undefined) {
      delete found_0.file;
    }

    // verify results
    expect(expectedFound_0).toEqual(found_0);
  });
});
