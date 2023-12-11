import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { SystemMemoryUsedMB } from '@idl/shared';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { MapTree } from './map-tree';

// create our index
const index = new IDLIndex(
  new LogManager({
    alert: () => {
      // do nothing
    },
  }),
  0
);

/**
 * Get the file
 */
// const file = '/Users/znorman/Desktop/test/lib/slicer3.pro';
const file = '/Users/znorman/Desktop/test/idlunitcollection__define.pro';

/**
 * Folder we write to
 */
const folder = '/Users/znorman/angular/vscode-idl/parse-test';

/**
 * Read content to memory
 */
const text = readFileSync(file, { encoding: 'utf-8' });

const fullFile = join(folder, 'tree-full.json');

const miniFile = join(folder, 'tree-mini.json');

// number of steps
const n = 1000;

/**
 * Main routine
 */
async function main() {
  console.log(`Parsing file`);
  // parse the file
  const parsed = await index.getParsedProCode(
    file,
    text,
    new CancellationToken(),
    {
      postProcess: false,
    }
  );

  // remove the scope detail
  RemoveScopeDetail(parsed, new CancellationToken(), true);

  // convert to mini tree
  console.log(`Converting tree!`);
  const mini = MapTree(parsed.tree);

  // write the full tree
  const sOrig = JSON.stringify(parsed.tree, undefined, undefined);
  writeFileSync(fullFile, sOrig);

  // write the mini tree
  const sMini = JSON.stringify(mini, undefined, undefined);
  writeFileSync(miniFile, sMini);

  // serialize time beginning
  const t0 = performance.now();
  for (let i = 0; i < n; i++) {
    JSON.stringify(parsed.tree);
  }
  console.log(`Before serialize time (ms): ${performance.now() - t0}`);

  // serialize time beginning
  const t1 = performance.now();
  for (let i = 0; i < n; i++) {
    JSON.parse(sOrig);
  }
  console.log(`Before parse time (ms): ${performance.now() - t1}`);

  // // serialize time beginning
  // const t2 = performance.now();
  // for (let i = 0; i < n; i++) {
  //   JSON.stringify(mini);
  // }
  // console.log(`After serialize time (ms): ${performance.now() - t2}`);

  // // serialize time beginning
  // const t3 = performance.now();
  // for (let i = 0; i < n; i++) {
  //   JSON.parse(sMini);
  // }
  // console.log(`After parse time (ms): ${performance.now() - t3}`);
}

/**
 * Test the memory!
 */
function memTest() {
  /** Track vals so we dont release memory */
  const tracker: { [key: string]: any } = {};

  // read teh text
  const txt = readFileSync(fullFile, { encoding: 'utf-8' });

  // load!
  console.log('Parsing file...');
  for (let i = 0; i < n; i++) {
    tracker[i] = JSON.parse(txt);
  }

  // get info
  console.log(`Memory usage (mb) for ${n} file(s): ${SystemMemoryUsedMB()}`);
}

// memTest();

main()
  .then(
    () => {
      process.exit();
    },
    (err) => {
      console.group(err);
      process.exit(1);
    }
  )
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
