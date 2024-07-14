import { IDLDocsExporter } from '@idl/docs/exporter';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { performance } from 'perf_hooks';

/** Get the folder with code in it */
// const codeDir = GetExtensionPath('idl/vscode');
const codeDir = 'C:\\Users\\znorman\\Documents\\idl\\EC-AnalystToolbox';

/** Specify the folder that we export to */
const outDir = GetExtensionPath('extension/docs');

/** Glob patterns we match against */
const matches: string[] = [];

/** Glob patterns we exclude files from */
const exclude: string[] = [
  // '**/idl/vscode/notebooks/envi/helpers/*',
  // '**/idl/vscode/notebooks/idlnotebook/*',
];

/** Do we export everything? */
const exportEverything = false;

/**
 * Main routine
 */
async function main() {
  // create our index
  const index = new IDLIndex(
    new LogManager({
      alert: () => {
        // do nothing
      },
    }),
    0,
    true
  );

  /** Index the folder */
  await index.indexWorkspace([codeDir], false);

  /** Export */
  const t0 = performance.now();
  console.log('Exporting....');
  await IDLDocsExporter(
    index,
    codeDir,
    outDir,
    matches,
    exclude,
    exportEverything
  );
  console.log(`  Exported in ${performance.now() - t0} ms`);
}

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
