import { Playground } from './playground';
import { GenerateAutomatedTests } from './test-maker/generate-automated-tests';

// check for arguments
const args = process.argv.slice(2);
let quit = false;

// check for args
if (args.length > 0) {
  quit = true;

  console.log('Creating tests, please wait...');
  GenerateAutomatedTests()
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
