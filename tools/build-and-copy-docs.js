const { execSync } = require('child_process');
const { cpSync, existsSync, rmSync } = require('fs');
const { join } = require('path');

// build the docs
execSync(`npm run docs:build`);

// get source docs folder
const inDir = join(process.cwd(), 'extension', 'docs', '.vitepress', 'dist');

// get destination docs folder
const outDir = join(process.cwd(), 'dist', 'docs');

// delete if it exists already
if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true });
}

// copy folder
cpSync(inDir, outDir, { recursive: true });
