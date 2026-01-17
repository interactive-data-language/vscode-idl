import { spawn } from 'child_process';
import * as os from 'os';
import { join } from 'path';
import { performance } from 'perf_hooks';

/**
 * Runs the ENVI/IDL task engine
 */
export function RunTaskEngine(
  taskName: string,
  parameters: { [key: string]: any },
  binDir: string
): Promise<{ [key: string]: any }> {
  return new Promise((resolve, reject) => {
    try {
      // Set the command line arguments to the executable.
      const commandArgs = ['ENVI', '--compile'];

      // init strings for standard error/standard out
      let outputJsonString = '';
      let errorString = '';

      /**
       * Get the task engine URI
       */
      const engineUri = join(
        binDir,
        os.platform() === 'win32' ? 'taskengine.exe' : 'taskengine'
      );

      const t0 = performance.now();

      // Extend the process environment with the config options.
      const command = spawn(engineUri, commandArgs, {
        cwd: os.tmpdir(),
      });

      // Collect stdout from our command
      command.stdout.on('data', (data: any) => {
        outputJsonString += data;
      });

      command.stderr.on('data', (data: any) => {
        errorString += data;
      });

      // Invoke our callback when the command is complete.
      command.on('close', (code: any) => {
        // Handle output from executable.
        if (code === 0) {
          // The command exit code signalled a success.
          let outputJson = null;
          try {
            // Parse the output string to JSON.
            outputJson = JSON.parse(outputJsonString);

            console.log(performance.now() - t0);

            // return
            resolve(outputJson['outputParameters']);
          } catch (err: any) {
            reject({ err, stdout: outputJsonString, stderr: errorString });
          }
        } else {
          reject({ code, stdout: outputJsonString, stderr: errorString });
        }
      });

      // Send the input to the process via stdin
      // Build the parameters to run the named task.
      const input = JSON.stringify({
        taskName: taskName,
        inputParameters: parameters,
      });

      // pipe in json
      command.stdin.write(input);

      if (os.platform() === 'win32') {
        command.stdin.write('\x04' + os.EOL);
      } else {
        command.stdin.end();
      }
    } catch (err: any) {
      reject(err);
    }
  });
}
