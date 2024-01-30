import * as express from 'express';

import { DOCS_SERVER_CONFIG } from './docs-server.interface';

/**
 * Starts an express server for to serve up static docs content
 */
export function StartExpressDocsServer() {
  /** Create express app */
  const app = express();

  /** Serve folder */
  app.use(express.static(DOCS_SERVER_CONFIG.FOLDER));

  /** Listen on the port */
  app.listen(DOCS_SERVER_CONFIG.PORT);
}
