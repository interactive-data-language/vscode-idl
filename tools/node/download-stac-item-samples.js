const { mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const ROOT = 'https://planetarycomputer.microsoft.com/api/stac/v1';
const OUT_DIR = join(process.cwd(), 'dist', 'stac-item-samples');
const CONCURRENCY = 4;
const MAX_ATTEMPTS = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Fetch JSON, retrying on 429 and 5xx with exponential backoff */
async function fetchJson(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'vscode-idl-stac-item-samples',
        },
      });
      if (res.ok) {
        return await res.json();
      }
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= MAX_ATTEMPTS) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
    } catch (err) {
      if (attempt >= MAX_ATTEMPTS) {
        throw err;
      }
    }
    await sleep(1000 * 2 ** (attempt - 1));
  }
}

async function sampleCollection(collection, results) {
  const id = collection.id;
  try {
    const items = await fetchJson(
      `${ROOT}/collections/${encodeURIComponent(id)}/items?limit=1`,
    );
    const item = items.features && items.features[0];
    if (!item) {
      results.skipped.push(id);
      console.log(`skipped (no items): ${id}`);
      return;
    }
    const fileName = `${id.replace(/[^A-Za-z0-9._-]/g, '_')}.json`;
    writeFileSync(join(OUT_DIR, fileName), JSON.stringify(item, null, 2));
    results.saved.push(id);
    console.log(`saved: ${fileName}`);
  } catch (err) {
    results.failed.push(id);
    console.error(`failed: ${id}: ${err.message}`);
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let collections;
  try {
    collections = (await fetchJson(`${ROOT}/collections`)).collections;
  } catch (err) {
    console.error(`ERROR: could not list collections: ${err.message}`);
    process.exit(1);
  }
  console.log(`Found ${collections.length} collections`);

  const results = { saved: [], skipped: [], failed: [] };
  const queue = [...collections];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      await sampleCollection(queue.shift(), results);
    }
  });
  await Promise.all(workers);

  console.log(
    `\nDone: ${results.saved.length} saved, ${results.skipped.length} skipped, ${results.failed.length} failed`,
  );
  console.log(`Output: ${OUT_DIR}`);
}

main();
