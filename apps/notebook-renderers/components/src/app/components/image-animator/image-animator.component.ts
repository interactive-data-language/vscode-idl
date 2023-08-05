import { Component } from '@angular/core';

export const IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR = 'idl-nb-image-animator';

@Component({
  selector: 'idl-nb-image-animator',
  templateUrl: './image-animator.component.html',
  styles: [
    `
      .controls {
        background: var(--vscode-editor-background);
        opacity: 85%;
      }
    `,
  ],
})
export class ImageAnimatorComponent {}
