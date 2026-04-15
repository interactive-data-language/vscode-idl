import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack, TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/Download_S3_URL.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'idldownload_s3_urltask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLDownload_S3_URLTask',
          source: 'user',
          docs: "\nThis task downloads a resource specified by an S3 URL into a local file.\n\n### Syntax\n\n```idl\n;+\n; :Returns: IDLTask<Download_S3_URL>\n;-\nmyTask = IDLTask('Download_S3_URL')\n\n; set input parameters\nmyTask.s3_url = value\nmyTask.local_file = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\n\n```\n\n\n### Input Parameters\n\n- **s3_url**: String\n\n  The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme.\n\n- **local_file**: String\n\n  The local file in which to download the S3 resource.\n\n",
          private: false,
          returns: [
            {
              name: 'idldownload_s3_urltask',
              display: 'IDLTask<download_s3_url>',
              serialized: 'IDLTask<download_s3_url>',
              args: [
                [
                  {
                    name: 'download_s3_url',
                    display: 'download_s3_url',
                    serialized: 'download_s3_url',
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
        name: 'idldownload_s3_urltask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLDownload_S3_URLTask',
          source: 'user',
          docs: 'This task downloads a resource specified by an S3 URL into a local file.\n\n\n### Properties\n\n- **s3_url**: String\n\n  The S3 URL to download.  This must use the HTTP[S] scheme, not S3 scheme.\n\n- **local_file**: String\n\n  The local file in which to download the S3 resource.\n\n',
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
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
            local_file: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'local_file',
              docs: 'The local file in which to download the S3 resource.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
          },
        },
      },
    };

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
