import { IFolderRecursion } from '@idl/parsing/index';
import copy from 'fast-copy';

/**
 * Smartly combines two folder recursion entries together
 */
export function MergeFolderRecursion(
  first: IFolderRecursion,
  second: IFolderRecursion
) {
  const copied = copy(first);

  const keys = Object.keys(second);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in copied) {
      // take highest recursion level
      copied[keys[i]] = copied[keys[i]] || second[keys[i]];
    } else {
      copied[keys[i]] = second[keys[i]];
    }
  }

  return copied;
}
