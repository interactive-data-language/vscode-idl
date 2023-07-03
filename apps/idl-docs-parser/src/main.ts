import { writeFileSync } from 'fs';
import { join } from 'path';

import { ParsedToGlobal } from './helpers/parsed-to-global';
import { SetTaskTypes } from './helpers/set-task-types';
import { IDL_DIR } from './idl-dir.interface';
import { MergeGlobalsForTypes } from './overrides/globals-for-types';
import { UNKNOWN_GUESSES } from './type-guess/type-guess';

async function Main() {
  /**
   * Folder with all of the help content
   */
  const helpDir = `${IDL_DIR}/help/online_help/Subsystems`;

  /** JSON file that was generated in IDL */
  const jsonUri = join(process.cwd(), `idl`, `routines`, `routines.json`);

  console.log();
  console.log(
    'Running this app requires ENVI, IDL, and ENVI Deep Learning be installed in order to run'
  );

  /** Get our global tokens to store in the language server */
  const global = await ParsedToGlobal(jsonUri, helpDir);

  // marge manual entries for types
  MergeGlobalsForTypes(global);

  // properly handle all task files
  await SetTaskTypes(global);

  // write to disk
  writeFileSync(
    join(process.cwd(), 'idl/routines/global.json'),
    JSON.stringify(global)
  );

  /**
   * We no longer need to save global display names, we just load it from disk
   * at runtime which is fast.
   *
   * It also reduces complexity since we now only store it once.
   */
  // /** Get the display names of all of our tokens */
  // const display = GlobalToDisplayNames(global);

  // // write to disk
  // writeFileSync(
  //   join(process.cwd(), 'idl/routines/display.json'),
  //   JSON.stringify(display)
  // );

  // save all of our type overrides to disk, now that they have been updated
  // SaveTypeOverrides();

  // write to disk
  writeFileSync(
    join(process.cwd(), './parse-test/unknown.json'),
    JSON.stringify(UNKNOWN_GUESSES, null, 2)
  );

  console.log('Done!');
  console.log('');
  console.log(
    'See "parse-test/unknowns.json" for a list of descriptions that have no data types for them'
  );
}

Main().catch((err) => {
  console.log(err);
  process.exit(1);
});
