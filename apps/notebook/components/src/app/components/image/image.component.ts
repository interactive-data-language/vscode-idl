import { Component, OnInit } from '@angular/core';
import {
  IDLNotebookImage_PNG,
  SaveImageRendererMessage,
} from '@idl/types/notebooks';

import { BaseRendererComponent } from '../base-renderer.component';

/**
 * ID for notebook image selector
 */
export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

/**
 * Component that displays an image
 */
@Component({
  selector: 'idl-nb-image',
  templateUrl: './image.component.html',
  styles: [
    `
      @import 'shared-styles.scss';
    `,
  ],
})
export class ImageComponent
  extends BaseRendererComponent<IDLNotebookImage_PNG>
  implements OnInit
{
  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  ngOnInit() {
    if (this.hasData) {
      this.src = `data:image/png;base64,${this._embed.item.data}`;
    }
  }

  /**
   * Send message to VSCode that we want to save a graphic
   */
  save() {
    this.messenger.postMessage<SaveImageRendererMessage>({
      type: 'save-image',
      payload: this._embed,
    });
  }
}
