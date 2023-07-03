import {
  IMessageFromWorker,
  IndexProblemsMessage,
  WorkerIOClient,
} from '@idl/workers/workerio';
import { parentPort } from 'worker_threads';

// create our connection client - overload MessagePort to assert that we are running in a worker thread
const client = new WorkerIOClient(parentPort);

console.log = (...args: any[]) => {
  client.log(args);
};
console.warn = (...args: any[]) => {
  client.log(args);
};
console.error = (...args: any[]) => {
  client.log(args);
};

/** Create our global symbol index */
const GLOBAL_INDEX = new GlobalIndex();

/**
 * Handle requests to retrieve and stretch tiles
 */
client.on('index-file', async (message) => {
  GLOBAL_INDEX.trackTokens(message.tokens, message.file);
});

/**
 * Handle requests to retrieve and stretch tiles
 */
client.on('index-remove-file', async (file) => {
  if (GLOBAL_INDEX.removeTokensForFile(file)) {
    const outgoing: IMessageFromWorker<IndexProblemsMessage> = {
      _id: 'problems',
      type: 'index-problems',
      payload: GLOBAL_INDEX.parseProblems,
    };
    client.postMessage(outgoing);
  }
});

/**
 * Listen for events from our main thread
 */
client.listen();
