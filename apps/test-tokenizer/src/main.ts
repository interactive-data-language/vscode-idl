import { Playground } from './playground';
import { GenerateAutomatedTests } from './test-maker/generate-automated-tests';

// check for arguments
const args = process.argv.slice(2);
let quit = false;

// check for args
if (args.length > 0) {
  quit = true;
  const flag = args[0];

  // check what our flag is
  let useCache = true;
  switch (flag) {
    case '--generate-all-tests':
      useCache = false;
      break;
    case '--generate-new-tests':
      useCache = true;
      break;
    default:
      console.log(`Unknown option of "${flag}"`);
      process.exit(1);
  }

  console.log('Creating tests, please wait...');
  GenerateAutomatedTests(useCache)
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
}

/**
 * Run our playground function for fun and kicks
 */
if (!quit) {
  Playground()
    .then(
      () => process.exit(),
      (err) => {
        console.log(err);
        process.exit(1);
      }
    )
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}
