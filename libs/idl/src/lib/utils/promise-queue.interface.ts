import { IDL } from '../idl.class';

export interface IPromiseQueueOptions {
  nConcurrent: number;
}

export interface IPromiseQueueLookup {
  statement: string;
  idl: IDL;
  cut?: boolean;
  idlInfo?: boolean;
  wait?: boolean;
}

export interface IPromiseQueueReturn {
  statement: string;
  output: string;
}

export interface IPromiseQueueItem {
  lookup: IPromiseQueueLookup;
  reject(value: any): void;
  promiseGenerator(): Promise<string>;
  resolve(value: IPromiseQueueReturn): void;
}
