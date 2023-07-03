import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
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
      0
    );

    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/token-def/tasks.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/tasks.pro'));

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/token-def/atanomalydetection.task')
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
        docs: 'Runs an automated anomaly detection using the Anomaly Detection workflow from ENVI Desktop.',
        private: false,
        returns: [
          {
            name: 'enviatanomalydetectiontask',
            display: 'ENVITask<atanomalydetection>',
            args: [
              [
                {
                  name: 'atanomalydetection',
                  display: 'atanomalydetection',
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
      position_0
    );
    if (found_0 !== undefined) {
      delete found_0.file;
    }

    // verify results
    expect(expectedFound_0).toEqual(found_0);
  });
});
