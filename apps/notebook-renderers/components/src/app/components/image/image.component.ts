import { Component, Input, SkipSelf } from '@angular/core';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
  IDLNotebookEncodedPNG,
} from '@idl/notebooks/types';

import { DataSharingService } from '../data-sharing.service';

/**
 * ID for notebook image selector
 */
export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

@Component({
  selector: 'idl-nb-image',
  templateUrl: './image.component.html',
  styles: [``],
})
export class ImageComponent {
  /**
   * Track if we set data or not
   */
  hasData = false;

  /**
   * Item we are embedding
   *
   * Use set to we can properly type because the ngSwitch case does not
   * handle it well
   */
  @Input()
  set embed(item: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>) {
    this.hasData = true;
    this._embed = item as IDLNotebookEmbeddedItem<IDLNotebookEncodedPNG>;
    this.src = `data:image/png;base64,${this._embed.item.data}`;
  }

  /**
   * True (correctly typed) item we are embedding
   */
  _embed!: IDLNotebookEmbeddedItem<IDLNotebookEncodedPNG>;

  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  /**
   * We can access the latest data directly through our dataService which tracks
   * the last value on $embed
   */
  constructor(@SkipSelf() private dataService: DataSharingService) {}
}
