import { ISimplePromiseQueueItem } from './simple-promise-queue.interface';

export class SimplePromiseQueue {
  nConcurrent: number; // how many promises can we process in parallel?
  nProcessing: number; // how many promises are we processing now?
  _requests: ISimplePromiseQueueItem[] = [];

  // options: IPromiseQueueOptions
  constructor(concurrent = 1) {
    this.nConcurrent = concurrent;
    this._requests = [];
    this.nProcessing = 0;
  }

  // add an item to process
  async add(promiseGenerator: () => Promise<void>) {
    return new Promise<void>((resolve, reject) => {
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

      // call our thing!
      item.promiseGenerator().then(
        async () => {
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
