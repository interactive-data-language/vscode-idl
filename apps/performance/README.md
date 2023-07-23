# Performance

This app is meant to track the performance of the application (memory, parse rate) to fine-tune performance.

## Usage

Two terminals/shells:

1. Build the app with update on save: `npm run start-perf`

2. Run performance with `npm run test-perf` (this adds flags to emulate the start from our language server)

3. Optionally run `npm run test-perf-profile` to also profile the node.js process

After running this, generate performance file using `node --prof-process isolate-0x7fddc5d4d000-28442-v8.log > perf.txt`
