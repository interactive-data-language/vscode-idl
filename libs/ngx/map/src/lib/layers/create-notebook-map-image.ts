import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap_Image,
} from '@idl/types/notebooks';

import { BoundsFromExtents } from '../helpers/bounds-from-extents';
import { CreateImage } from './create-image';
import { CreatedLayerNotebookMapLayer } from './created-layer.interface';

/**
 * Creates a notebook map image
 */
export function CreateNotebookMapImage(params: {
  name: string;
  image: IDLNotebookEmbeddedItem<IDLNotebookMap_Image>;
}): CreatedLayerNotebookMapLayer<'image'> {
  const bounds = BoundsFromExtents(params.image.item.extents);

  return {
    bounds,
    notebookLayer: {
      type: 'image',
      name: params.name,
      embed: params.image,
      layer: CreateImage(params.image),
      props: {
        opacity: 1,
      },
    },
  };
}
