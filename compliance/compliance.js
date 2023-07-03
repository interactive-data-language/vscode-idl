/**
 * Import our compliance generators. There are three flavors:
 * - GenerateCompliance: Used for a monorepo with a single package.json file
 * - GenerateComplianceForLerna: Used for lerna monorepos with a `packages` folder to process
 * - GenerateComplianceForMonorepo: Used for repositories that live in one folder and have
 * multiple package.json files in sub directories.
 */
const { GenerateCompliance } = require('@vis/compliance');

// generate our compliance files and exit on completion
GenerateCompliance()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
