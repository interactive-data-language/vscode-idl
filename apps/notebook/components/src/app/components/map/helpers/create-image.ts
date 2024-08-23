import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap_Image,
} from '@idl/types/notebooks';
import { nanoid } from 'nanoid';

import { AwesomeImage } from './awesome-image.class';

export function CreateImage(
  embed: IDLNotebookEmbeddedItem<IDLNotebookMap_Image>,
  props = {}
) {
  /** Get image extents */
  const extent = embed.item.extents;

  // embedLayers.push(
  //   new BitmapLayer({
  //     id: 'bitmap-layer',
  //     image: `data:image/png;base64,${typed.item.data}`,
  //     bounds: [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
  //     parameters: {},
  //   })
  // );

  return new AwesomeImage({
    id: nanoid(),
    image: `data:image/png;base64,${embed.item.data}`,
    bounds: [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
    pickable: false,
    ...props,
  });
}
