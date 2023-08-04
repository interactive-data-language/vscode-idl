import { Component } from '@angular/core';

/**
 * ID for notebook image selector
 */
export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

@Component({
  selector: 'idl-nb-image',
  templateUrl: './image.component.html',
  styles: [
    `
      .idl-nb-image {
        color: red !important;
        font-style: italic !important;
        background-color: aqua !important;
      }
    `,
  ],
})
export class ImageComponent {}
