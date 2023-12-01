import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { Tokenizer } from '@idl/parsing/tokenizer';
import { TimeItAsync } from '@idl/shared';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as progressBar from 'progress';

import { ExportPopularity } from './routine-popularity';

interface IProblem {
  line: number;
  text: string;
  erased: string;
}

/**
 * Parses all code in a folder to check for problems with parsing or syntax
 */
export async function TokenizerTest(
  folder: string,
  useIndex = false
): Promise<void> {
  const name = useIndex ? 'Index' : 'Tokenizer';

  // create our index
  const index = new IDLIndex(
    new LogManager({
      alert: () => {
        // do nothing
      },
    })
  );

  // search for files
  // const files = await glob('**/**.pro', { cwd: folder });
  const files = await index.findFiles(folder, '**/**.pro');
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
    const read = readFileSync(files[i], 'utf-8').split('\n');
    lines += read.length;
    code.push(read);
  }
  bar.complete = true;
  bar.render();

  // track the problems for parsing any files
  const problems: {
    [key: string]: { tokens: IProblem[]; syntax: any };
  } = {};

  const offset = 0;

  // process all files
  const t2 = await TimeItAsync(async () => {
    const bar2 = new progressBar(
      `Extracting tokens via ${name} [:bar] :etas :title :file`,
      {
        total: files.length,
        width: 25,
      }
    );
    for (let i = 0; i < code.length; i++) {
      const canTick = true;

      // extract tokens
      if (useIndex) {
        // TrackPopularity(index, await index.indexCode(files[i], code[i], true));
        await index.getParsedProCode(
          files[i],
          code[i],
          new CancellationToken(),
          { postProcess: true }
        );
      } else {
        Tokenizer(code[i], new CancellationToken());
      }

      // tick the bar if we can
      if (canTick) {
        bar2.tick({
          title: `${i + 1}/${files.length}`,
          file: files[i],
        });
      }
    }

    // bar2.tick({
    //   title: `Indexing`,
    //   file: `workspace with threads`,
    // });
    // await index.indexWorkspace(folder);

    bar2.complete = true;
    bar2.render();
  });
  console.log(`  Processing time (ms): ${t2}`);
  console.log(`  Processing rate (lines/s): ${lines / ((t2 - offset) / 1000)}`);
  console.log(``);

  ExportPopularity();

  // write our problems to disk
  if (Object.keys(problems).length > 0) {
    console.log(
      `Problems were detected!!! See "parse-test/parse-test-problems.json" in main repository folder`
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'parse-test-problems.json'),
      JSON.stringify(problems, null, 2)
    );
  }
}
