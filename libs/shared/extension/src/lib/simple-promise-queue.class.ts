import { ISimplePromiseQueueItem } from './simple-promise-queue.interface';

export class SimplePromiseQueue {
  nConcurrent: number; // how many promises can we process in parallel?
  nProcessing: number; // how many promises are we processing now?
  _requests: ISimplePromiseQueueItem[] = [];
  lastReject?: (reason?: any) => void;

  // options: IPromiseQueueOptions
  constructor(concurrent = 1) {
    this.nConcurrent = concurrent;
    this._requests = [];
    this.nProcessing = 0;
  }

  // add an item to process
  async add(
    promiseGenerator: () => Promise<void>,
    getRejector?: (rejector: (reason?: any) => void) => void
  ) {
    return new Promise<void>((resolve, reject) => {
      if (getRejector) {
        getRejector(reject);
      }
      this._requests.push({
        promiseGenerator: promiseGenerator,
        resolve: resolve,
        reject: reject,
      });

      // try to process something
      this._next();
    });
  }

  clear() {
    this._requests = [];
    this.nProcessing = 0;
    if (this.lastReject !== undefined) {
      this.lastReject('cleared queue');
    }
  }

  // process items in the queue
  _next() {
    // make sure we can process
    if (this.nProcessing >= this.nConcurrent || this._requests.length === 0) {
      return;
    }

    // get the next item
    const item = this._requests.shift();
    if (!item) {
      return;
    }

    try {
      // increment counter
      this.nProcessing++;

      // save last reject
      this.lastReject = item.reject;

      // call our thing!
      item.promiseGenerator().then(
        async () => {
          this.lastReject = undefined;
          try {
            this.nProcessing--;
            item.resolve();
            this._next();
          } catch (err) {
            this.nProcessing--;
            item.reject(err);
            this._next();
          }
        },
        (err: any) => {
          this.nProcessing--;
          item.reject(err);
          this._next();
        }
      );
    } catch (err) {
      this.nProcessing--;
      item.reject(err);
      this._next();
    }
  }
}
