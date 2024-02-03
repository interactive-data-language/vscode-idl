import { TimeItAsync } from '@idl/shared';
import { TextMateParse } from '@idl/tests/helpers';
import * as glob from 'fast-glob';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as progressBar from 'progress';

interface IProblem {
  line: number;
  text: string;
  erased: string;
}

/**
 * Parses all code in a folder with TextMate grammar to assess performance
 */
export async function TMParseTest(
  folder: string,
  removeColon = false
): Promise<void> {
  // search for files
  const files = await glob('**/**.pro', { cwd: folder });
  if (files.length === 0) {
    throw new Error(`No ".pro" files found in "${folder}"`);
  }

  // init array for code
  const code: string[][] = [];
  let lines = 0;

  // read all files
  const bar = new progressBar('Reading files [:bar] :etas :title :file', {
    total: files.length,
    width: 25,
  });
  for (let i = 0; i < files.length; i++) {
    bar.tick({
      title: `${i + 1}/${files.length}`,
      file: files[i],
    });
    const read = readFileSync(join(folder, files[i]), 'utf-8').split('\n');
    lines += read.length;
    code.push(read);
  }
  bar.complete = true;
  bar.render();

  // process all files
  const t2 = await TimeItAsync(async () => {
    const bar2 = new progressBar(
      'Extracting tokens via TextMate [:bar] :etas :title :file',
      {
        total: files.length,
        width: 25,
      }
    );
    for (let i = 0; i < code.length; i++) {
      const canTick = true;

      // extract tokens
      await TextMateParse(code[i]);

      // tick the bar if we can
      if (canTick) {
        bar2.tick({
          title: `${i + 1}/${files.length}`,
          file: files[i],
        });
      }
    }
    bar2.complete = true;
    bar2.render();
  });
  console.log(`  Processing time (ms): ${t2}`);
  console.log(`  Processing rate (lines/s): ${lines / (t2 / 1000)}`);
  console.log(``);
}
