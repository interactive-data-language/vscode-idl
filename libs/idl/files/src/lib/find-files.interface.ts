/**
 * Data structure that tracks recursion for folders that we
 * need to process so that we match how IDL works
 */
export interface IFolderRecursion {
  [key: string]: boolean;
}
