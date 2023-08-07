import { Component, OnInit, SkipSelf } from '@angular/core';
import { IDLNotebookEncodedPNG } from '@idl/notebooks/types';

import { BaseRendererComponent } from '../base-renderer.component';
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
export class ImageComponent
  extends BaseRendererComponent<IDLNotebookEncodedPNG>
  implements OnInit
{
  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  /**
   * We can access the latest data directly through our dataService which tracks
   * the last value on $embed
   */
  constructor(@SkipSelf() private dataService: DataSharingService) {
    super();
  }

  ngOnInit() {
    if (this.hasData) {
      this.src = `data:image/png;base64,${this._embed.item.data}`;
    }
  }
}
