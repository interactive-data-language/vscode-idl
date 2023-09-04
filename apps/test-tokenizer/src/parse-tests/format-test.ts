import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { GetTokenNames, Parser } from '@idl/parser';
import { TimeIt } from '@idl/shared';
import { deepEqual } from 'fast-equals';
import * as glob from 'fast-glob';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as progressBar from 'progress';

interface IProblem {
  line: number;
  text: string;
  erased: string;
}

/**
 * Parses, formats, and then parses again adn makes sure tokens match
 */
export async function FormatTest(folder: string): Promise<void> {
  // search for files
  const files = await glob('**/**.pro', { cwd: folder, dot: true });
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

  // track the problems for parsing any files
  const problems: {
    [key: string]: { tokens: IProblem[]; syntax: any };
  } = {};

  let offset = 0;

  // process all files
  const t2 = TimeIt(() => {
    const bar2 = new progressBar(
      'Extracting tokens and validating formatting [:bar] :etas :title :file',
      {
        total: files.length,
        width: 25,
      }
    );
    for (let i = 0; i < code.length; i++) {
      let canTick = true;
      // extract tokens
      const tokenized = Parser(code[i], new CancellationToken());

      // validate formatting for code
      // track time so we can more  accurately represent true parsing time
      // since this will double processing time
      offset += TimeIt(() => {
        // extract token names
        const tokenizedNames = GetTokenNames(tokenized);

        // format code
        const formatted = Assembler(tokenized, new CancellationToken(), {
          formatter: 'fiddle',
        });

        // verify that our tokens are the same as they were before
        if (formatted !== undefined) {
          // parse formatted code
          const reParsed = Parser(formatted, new CancellationToken());

          // make sure things equal
          if (!deepEqual(GetTokenNames(reParsed), tokenizedNames)) {
            console.log('');
            console.log(`Problem processing file: ${files[i]}`);
            canTick = false;
          }
        }
      });

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
  console.log(`  Processing rate (lines/s): ${lines / ((t2 - offset) / 1000)}`);
  console.log(``);

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
