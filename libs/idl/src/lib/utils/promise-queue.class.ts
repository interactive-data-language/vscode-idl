import { IDL_TRANSLATION } from '@idl/translation';

import { IDL } from '../idl.class';
import {
  IPromiseQueueItem,
  IPromiseQueueLookup,
  IPromiseQueueReturn,
} from './promise-queue.interface';

export class PromiseQueue {
  nConcurrent: number; // how many promises can we process in parallel?
  nProcessing: number; // how many promises are we processing now?
  _requests: IPromiseQueueItem[] = [];

  idl: IDL;

  // options: IPromiseQueueOptions
  constructor(idl: IDL) {
    this.nConcurrent = 1;
    this._requests = [];
    this.nProcessing = 0;
    this.idl = idl;
  }

  // add an item to process
  async add(
    lookup: IPromiseQueueLookup,
    promiseGenerator: () => Promise<string>
  ) {
    return new Promise<IPromiseQueueReturn>((resolve, reject) => {
      // check if we are cutting in line
      if (lookup.cut) {
        this._requests = [
          {
            promiseGenerator: promiseGenerator,
            lookup: lookup,
            resolve: resolve,
            reject: reject,
          },
        ].concat(this._requests);
      } else {
        this._requests.push({
          promiseGenerator: promiseGenerator,
          lookup: lookup,
          resolve: resolve,
          reject: reject,
        });
      }

      // try to process something
      if (!lookup.wait) {
        this._next();
      }
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
        async (value: string) => {
          try {
            // go to the next thing
            item.resolve({
              statement: item.lookup.statement,
              output: value,
            });
            this.nProcessing--;
            this._next();
          } catch (err) {
            this.idl.log.log({
              content: [
                'Error resolving promise for executing IDL statement',
                err,
              ],
              type: 'error',
              alert: IDL_TRANSLATION.debugger.adapter.promiseResolveError,
            });
            // go to the next thing
            item.resolve({
              statement: item.lookup.statement,
              output: value,
            });
            this.nProcessing--;
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
