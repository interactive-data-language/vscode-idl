import type { IDLNotebookMap_Extents } from '@idl/types/notebooks';

import type { LayerBounds } from '../create-layers.interface';

/**
 * Creates bounds from image extents
 */
export function BoundsFromExtents(extent: IDLNotebookMap_Extents): LayerBounds {
  return [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
}
