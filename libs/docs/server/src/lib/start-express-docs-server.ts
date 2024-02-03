import * as express from 'express';

import { DOCS_SERVER_CONFIG } from './docs-server.interface';

/**
 * Check if server is started or not
 */
let IS_EXPRESS_SERVER_STARTED = false;

/**
 * Starts an express server for to serve up static docs content
 */
export function StartExpressDocsServer(
  failCallback: (err: any) => void,
  port = DOCS_SERVER_CONFIG.PORT
) {
  /**
   * Return if already started
   */
  if (IS_EXPRESS_SERVER_STARTED) {
    return;
  }

  /** Create express app */
  const app = express();

  /** Serve folder */
  app.use(express.static(DOCS_SERVER_CONFIG.FOLDER));

  /**
   * handle exceptions
   */
  process.on('uncaughtException', (err) => {
    if (err.message.includes('EADDRINUSE')) {
      failCallback(err);
    } else {
      console.error(err);
    }
  });

  /** Listen on the port */
  app.listen(port);

  /** update flag that the server started */
  IS_EXPRESS_SERVER_STARTED = true;
}
