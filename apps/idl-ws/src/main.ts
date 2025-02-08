import { IDlWebSocketServer } from '@idl/idl/ws-server';
import { IDL_WS_CONSOLE, IDL_WS_SERVER, LogManager } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
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
 * Old console.log routine
 */
const OLD_LOG = console.log;
const OLD_WARN = console.warn;
const OLD_ERROR = console.error;

// replace logs
console.log = (...args: any[]) => {
  LOG_MANAGER.log({
    log: IDL_WS_CONSOLE,
    content: args,
  });
};
console.warn = (...args: any[]) => {
  LOG_MANAGER.log({
    log: IDL_WS_CONSOLE,
    content: args,
    type: 'warn',
  });
};
console.error = (...args: any[]) => {
  LOG_MANAGER.log({
    log: IDL_WS_CONSOLE,
    content: args,
    type: 'error',
    alert: IDL_TRANSLATION.lsp.errors.unhandled,
  });
};

/** Host for server */
const HOST = process.env.HOST ?? 'localhost';

/** Port for server */
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

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
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // setup express
  app.use(cors());
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
    /**
     * Create our web socket server class that manages
     * sending/receiving web socket messages
     */
    const idlWsServer = new IDlWebSocketServer(
      socket,
      LOG_MANAGER.getLog(IDL_WS_SERVER)
    );

    /**
     * Listen to events
     *
     * Separate so there can be authentication or something else before
     * everything just works
     */
    idlWsServer.listen();

    // print that we have connection
    console.log(`User connected: ${socket.id}`);

    /**
     * Listen for disconnects so we can cleanup
     */
    socket.on('disconnect', () => {
      // print disconnection
      console.log(`User disconnected: ${socket.id}`);

      // cleanup connection for this user
      idlWsServer.cleanup();
    });
  });

  // have express listen
  app.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  });
}

// start server and listen
main();
