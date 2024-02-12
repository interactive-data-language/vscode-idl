import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { SystemMemoryUsedMB } from '@idl/shared';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { MapTreeSingle } from './map-tree-single';

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
const n = 100;

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
  const mini = MapTreeSingle(parsed.tree);

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

  // serialize time beginning
  const t2 = performance.now();
  for (let i = 0; i < n; i++) {
    JSON.stringify(mini);
  }
  console.log(`After serialize time (ms): ${performance.now() - t2}`);

  // serialize time beginning
  const t3 = performance.now();
  for (let i = 0; i < n; i++) {
    JSON.parse(sMini);
  }
  console.log(`After parse time (ms): ${performance.now() - t3}`);

  // // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  // const miniProto = { items: mini };
  // console.log(`Elements: ${mini.length}`);
  // const errMsg = SYNTAX_TREE.verify(miniProto);
  // if (errMsg) throw Error(errMsg);

  // console.log('It is valid');

  // // Create a new message
  // const newMessage = SYNTAX_TREE.create(miniProto); // or use .fromObject if conversion is necessary
  // console.log('Make a new message!');

  // // Encode a message to an Uint8Array (browser) or Buffer (node)
  // const buffer = SYNTAX_TREE.encode(newMessage).finish();
  // console.log(`Bytes: ${buffer.length}`);
  // writeFileSync(miniFile, buffer);
  // console.log('Buffered and written');

  // // Decode an Uint8Array (browser) or Buffer (node) to a message
  // const decoded = SYNTAX_TREE.decode(buffer);

  // // ... do something with message
  // console.log(`Decoded length: ${(decoded as any)?.items?.length}`);

  // // serialize time beginning
  // const t0 = performance.now();
  // for (let i = 0; i < n; i++) {
  //   JSON.stringify(parsed.tree);
  // }
  // console.log(`Before serialize time (ms): ${performance.now() - t0}`);

  // // serialize time beginning
  // const t1 = performance.now();
  // for (let i = 0; i < n; i++) {
  //   JSON.parse(sOrig);
  // }
  // console.log(`Before parse time (ms): ${performance.now() - t1}`);

  // // serialize time beginning
  // const t2 = performance.now();
  // for (let i = 0; i < n; i++) {
  //   SYNTAX_TREE.encode(SYNTAX_TREE.create(miniProto)).finish();
  //   // JSON.stringify(mini);
  // }
  // console.log(`After serialize time (ms): ${performance.now() - t2}`);

  // // serialize time beginning
  // const t3 = performance.now();
  // for (let i = 0; i < n; i++) {
  //   SYNTAX_TREE.decode(buffer);
  //   // JSON.parse(sMini);
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
  const txt = readFileSync(miniFile, { encoding: 'utf-8' });

  // load!
  console.log('Parsing file...');
  for (let i = 0; i < n; i++) {
    tracker[i] = JSON.parse(txt);
  }

  // // read teh text
  // const txt = new Uint8Array(readFileSync(miniFile));

  // // load!
  // console.log('Parsing file...');
  // for (let i = 0; i < n; i++) {
  //   tracker[i] = SYNTAX_TREE.decode(txt);
  // }

  // get info
  console.log(`Memory usage (mb) for ${n} file(s): ${SystemMemoryUsedMB()}`);
}

memTest();

main()
  .then(
    () => {
      process.exit();
    },
    (err) => {
      console.log(err);
      process.exit(1);
    }
  )
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
