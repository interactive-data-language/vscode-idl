import { existsSync, readFileSync } from 'fs';

import { ICurrentCell } from '../idl-notebook-controller.interface';
import { AddEncodedImageToCell } from './add-encoded-image-to-cell';

/**
 * Adds an image to a cell
 */
export function AddPNGFileToCell(
  cell: ICurrentCell,
  uri: string,
  width: number,
  height: number
) {
  // return if the file is missing
  if (!existsSync(uri)) {
    return;
  }

  // encode and add
  AddEncodedImageToCell(
    cell,
    Buffer.from(readFileSync(uri)).toString('base64'),
    width,
    height
  );
}
