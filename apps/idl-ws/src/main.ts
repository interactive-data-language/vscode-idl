import { IDlWebSocketServer } from '@idl/idl/ws-server';
import { IDL_WS_SERVER, LogManager } from '@idl/logger';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

/**
 * Create new log manager
 */
const LOG_MANAGER = new LogManager({
  alert: () => {
    // do nothing
  },
});

/**
 * The below block of code creates a circular logging call stack because the log
 * manager doesn't have an interceptor set up
 *
 * For now, leave the logs to print out in our server process and don't
 * worry about anything in the client.
 *
 * This should be OK since 90% of the information makes it back to the client
 * and can be in logs for debugging.
 */

// /**
//  * Old console.log routine
//  */
// const OLD_LOG = console.log;
// const OLD_WARN = console.warn;
// const OLD_ERROR = console.error;

// // replace logs
// console.log = (...args: any[]) => {
//   LOG_MANAGER.log({
//     log: IDL_WS_CONSOLE,
//     content: args,
//   });
// };
// console.warn = (...args: any[]) => {
//   LOG_MANAGER.log({
//     log: IDL_WS_CONSOLE,
//     content: args,
//     type: 'warn',
//   });
// };
// console.error = (...args: any[]) => {
//   LOG_MANAGER.log({
//     log: IDL_WS_CONSOLE,
//     content: args,
//     type: 'error',
//     alert: IDL_TRANSLATION.lsp.errors.unhandled,
//   });
// };

/** Host for server */
const HOST = process.env.HOST ?? 'localhost';

/** Port for server */
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

/**
 * Additional allowed web origins (comma-separated) for hosted deployments of
 * the web client. Loopback origins are always allowed; everything else must be
 * listed here. Replaces the previous, unsafe `origin: '*'` configuration which
 * allowed any website to connect and execute IDL (drive-by RCE / CSWSH).
 */
const EXTRA_ALLOWED_ORIGINS = (process.env.IDL_WS_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

/**
 * Optional shared secret. When `IDL_WS_TOKEN` is set, every socket must present
 * it (via `auth.token` or the `x-idl-ws-token` header) before any IDL command
 * is processed. Strongly recommended for any non-loopback deployment.
 */
const AUTH_TOKEN = process.env.IDL_WS_TOKEN ?? '';

/**
 * Returns whether a browser Origin is allowed to connect. Requests without an
 * Origin header (native, non-browser clients) are allowed; loopback origins are
 * always allowed; any other origin must be in `IDL_WS_ALLOWED_ORIGINS`.
 */
function isAllowedOrigin(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  // pull the hostname out of the origin (strip scheme, path, and port)
  let host = origin.replace(/^[a-z]+:\/\//i, '');
  const slash = host.indexOf('/');
  if (slash !== -1) {
    host = host.slice(0, slash);
  }
  if (host.startsWith('[')) {
    const end = host.indexOf(']');
    host = end !== -1 ? host.slice(1, end) : host;
  } else {
    const colon = host.lastIndexOf(':');
    if (colon !== -1) {
      host = host.slice(0, colon);
    }
  }
  host = host.toLowerCase();

  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    return true;
  }

  return EXTRA_ALLOWED_ORIGINS.includes(origin);
}

/** CORS origin callback shared by Express and Socket.IO */
const corsOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => {
  callback(null, isAllowedOrigin(origin));
};

/**
 * Wraps server startup and execution
 */
function main() {
  /** Create express app */
  const app = express();

  /** Make HTTP server */
  const server = createServer(app);

  /** Start socket IO server */
  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  // warn loudly if the server is left unauthenticated
  if (!AUTH_TOKEN) {
    console.warn(
      '[idl-ws] WARNING: IDL_WS_TOKEN is not set - connections are not authenticated. ' +
        'Only loopback and explicitly allow-listed origins can connect. ' +
        'Set IDL_WS_TOKEN to require a shared secret for any networked deployment.',
    );
  }

  /**
   * Reject sockets from disallowed origins and (when configured) sockets that
   * do not present the shared secret. Runs before any IDL command is handled.
   */
  io.use((socket, next) => {
    const origin = socket.handshake.headers.origin;
    if (!isAllowedOrigin(origin)) {
      next(new Error('Origin not allowed'));
      return;
    }

    if (AUTH_TOKEN) {
      const provided =
        (socket.handshake.auth && socket.handshake.auth.token) ||
        socket.handshake.headers['x-idl-ws-token'];
      if (provided !== AUTH_TOKEN) {
        next(new Error('Unauthorized'));
        return;
      }
    }

    next();
  });

  // setup express
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  // API stub
  app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
  });

  /**
   * Handle new web socket connections
   *
   * TODO: How to get console logs to client-side connection for IDL process?
   */
  io.on('connection', (socket) => {
    // print that we have connection
    console.log(`User connected: ${socket.id}`);

    /**
     * Create our web socket server class that manages
     * sending/receiving web socket messages
     */
    let idlWsServer: IDlWebSocketServer;

    try {
      idlWsServer = new IDlWebSocketServer(
        socket,
        LOG_MANAGER.getLog(IDL_WS_SERVER),
      );

      /**
       * Listen to events
       *
       * Separate so there can be authentication or something else before
       * everything just works
       */
      idlWsServer.listen();
    } catch (err) {
      console.log(err);
    }

    /**
     * Listen for disconnects so we can cleanup
     */
    socket.on('disconnect', () => {
      try {
        // print disconnection
        console.log(`User disconnected: ${socket.id}`);

        // cleanup connection for this user
        if (idlWsServer) {
          idlWsServer.cleanup();
        }
      } catch (err) {
        console.log('Error cleaning up on disconnect', err);
      }
    });
  });

  // have express listen
  server.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  });
}

// start server and listen
main();
