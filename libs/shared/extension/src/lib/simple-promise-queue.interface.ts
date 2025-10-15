export interface ISimplePromiseQueueOptions {
  nConcurrent: number;
}

export interface ISimplePromiseQueueItem {
  promiseGenerator(): Promise<void>;
  reject(value: any): void;
  resolve(): void;
}
