import { LogManager } from '@idl/logger';
import { Parser } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { Tokenizer } from '@idl/parsing/tokenizer';
import {
  ALL_FILES_GLOB_PATTERN,
  IDL_JSON_GLOB_PATTERN,
  NOTEBOOK_GLOB_PATTERN,
  PRO_CODE_GLOB_PATTERN,
  SAVE_FILE_GLOB_PATTERN,
  SystemMemoryUsedGB,
  TASK_FILE_GLOB_PATTERN,
  TimeItAsync,
} from '@idl/shared';
import { readFileSync } from 'fs';
import { performance } from 'perf_hooks';
import * as progressBar from 'progress';

import { IParsingPerformanceRunnerOpts } from './options.interface';

interface IProblem {
  line: number;
  text: string;
  erased: string;
}

/**
 * Parses all code in a folder to check for problems with parsing or syntax
 */
export async function ParsingPerformanceRunner(
  folder: string,
  options: IParsingPerformanceRunnerOpts
): Promise<void> {
  const manager = new LogManager({
    alert: () => {
      // do nothing
    },
  });

  /**
   *
   */
  IDL_INDEX_OPTIONS.COMPRESSION = options.compression;

  // create our index
  const index = new IDLIndex(manager, 0);

  // log details
  manager.log({
    content: ['Performance test', JSON.stringify(options, null, 2)],
  });

  if (options.method === 'file-search') {
    let speedSearch: string[] = [];
    // search for files
    const t0 = performance.now();

    let patterns = [
      PRO_CODE_GLOB_PATTERN,
      SAVE_FILE_GLOB_PATTERN,
      IDL_JSON_GLOB_PATTERN,
      TASK_FILE_GLOB_PATTERN,
      NOTEBOOK_GLOB_PATTERN,
    ];
    patterns = [ALL_FILES_GLOB_PATTERN];
    for (let i = 0; i < patterns.length; i++) {
      speedSearch = speedSearch.concat(
        await index.findFiles(folder, patterns[i])
      );
    }

    manager.log({
      content: `Data discovery found ${
        speedSearch.length
      } file(s) in ${Math.floor(performance.now() - t0)} ms`,
    });
    return;
  }

  // search for files
  const t0 = performance.now();
  const all = await index.findFiles(folder);
  const bucket = index.bucketFiles(all);
  const files = bucket.proFiles;
  manager.log({
    content: `Data discovery found ${files.length} file(s) in ${Math.floor(
      performance.now() - t0
    )} ms`,
  });
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

  // increment lines
  lines *= options.multiplier;

  const offset = 0;

  /**
   * get number of files we process
   */
  const nFiles = code.length * options.multiplier;

  // process all files
  const t2 = await TimeItAsync(async () => {
    const bar2 = new progressBar(
      `Extracting tokens via "${options.method}" [:bar] :etas :title :file`,
      {
        total: nFiles,
        width: 25,
      }
    );
    for (let j = 0; j < nFiles; j++) {
      const canTick = true;

      const i = Math.floor(j / options.multiplier);

      // tick the bar if we can
      if (canTick) {
        bar2.tick({
          title: `${j + 1}/${nFiles}`,
          file: files[j],
        });
      }

      switch (options.method) {
        case 'tokenizer':
          Tokenizer(code[i]);
          break;
        case 'parser':
          Parser(code[i], options);
          break;
        case 'index-single':
          if (global.gc) {
            if (i % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
              global.gc();
            }
          }
          // index and make up file
          await index.getParsedProCode(`${j}.pro`, code[i], options);
          break;
        default:
          throw new Error(`Not implemented: ${options.method}`);
      }
    }

    // bar2.tick({
    //   title: `Indexing`,
    //   file: `workspace with threads`,
    // });
    // await index.indexWorkspace(folder, false);

    bar2.complete = true;
    bar2.render();
  });
  console.log(``);

  // log details
  manager.log({
    content: [
      'Performance',
      {
        time_ms: Math.floor(t2),
        memory_gb: SystemMemoryUsedGB(),
        lines,
        rate: Math.floor(lines / ((t2 - offset) / 1000)),
      },
    ],
  });
}
