export interface ISimplePromiseQueueOptions {
  nConcurrent: number;
}

export interface ISimplePromiseQueueItem {
  reject(value: any): void;
  promiseGenerator(): Promise<void>;
  resolve(): void;
}
