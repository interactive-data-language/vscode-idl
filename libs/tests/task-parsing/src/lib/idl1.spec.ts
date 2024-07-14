import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';
import { GlobalTokens } from '@idl/types/core';
import { TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/Download_S3_URL.task'
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: GlobalTokens = [
      {
        type: 's',
        name: 'idldownload_s3_urltask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLDownload_S3_URLTask',
          source: 'user',
          docs: 'This task downloads a resource specified by an S3 URL into a local file.',
          private: false,
          inherits: ['idltask'],
          docsLookup: {},
          props: {
            s3_url: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 's3_url',
              docs: 'The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            local_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'local_file',
              docs: 'The local file in which to download the S3 resource.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
        },
      },
      {
        type: 'f',
        name: 'idldownload_s3_urltask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLDownload_S3_URLTask',
          source: 'user',
          docs: 'This task downloads a resource specified by an S3 URL into a local file.',
          private: false,
          returns: [
            {
              name: 'idldownload_s3_urltask',
              display: 'IDLTask<download_s3_url>',
              args: [
                [
                  {
                    name: 'download_s3_url',
                    display: 'download_s3_url',
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
    ];

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
