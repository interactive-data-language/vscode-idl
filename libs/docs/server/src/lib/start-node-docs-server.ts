import { accessSync, constants } from 'fs';
import { readFile } from 'fs/promises';
import { createServer } from 'http';
import { lookup } from 'mime-types';
import { extname, join, normalize, resolve } from 'path';

import { DOCS_SERVER_CONFIG } from './docs-server.interface';

/**
 * Starts a pure node.js server to serve up documentation
 */
export async function StartNodeDocsServer(dir = DOCS_SERVER_CONFIG.FOLDER) {
  /**
   * Start our server
   */
  const server = createServer(async (req, res) => {
    /** Get extension of requested URL */
    let extension = extname(req.url);

    /**
     * Resolve the name of the file that we will process
     */
    let fileName = req.url;

    /**
     * Determine what we do next
     */
    switch (true) {
      case req.url === '/':
        fileName = 'index.html';
        extension = extname(fileName);
        break;
      case !extension:
        try {
          accessSync(join(dir, req.url + '.html'), constants.F_OK);
          fileName = req.url + '.html';
        } catch (e) {
          fileName = join(req.url, 'index.html');
        }

        // update extension
        extension = extname(fileName);
        break;
      default:
        break;
    }

    /** Check type of file */
    const type = lookup(extension);

    /**
     * Check if not a supported file type
     */
    if (!type) {
      console.log(`No type: "${fileName}"`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
      return;
    }

    /** Get fill file path */
    const filePath = join(dir, fileName);

    /**
     * Make sure we only request files in the folder we serve from
     */
    if (!normalize(resolve(filePath)).startsWith(dir)) {
      console.log(`Not in folder: "${fileName}"`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
      return;
    }
    try {
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    } catch (err) {
      console.log(err);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
    }
  });

  // start listening
  server.listen(DOCS_SERVER_CONFIG.PORT, () => {
    console.log(`Server is listening on port ${DOCS_SERVER_CONFIG.PORT}`);
  });
}
