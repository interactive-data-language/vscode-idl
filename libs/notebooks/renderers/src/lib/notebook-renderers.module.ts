import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import {
  IDL_NB_IMAGE_COMPONENT_SELECTOR,
  IDLNBImageComponent,
} from './idl-nb-image/idl-nb-image.component';

@NgModule({
  imports: [CommonModule, IDLNBImageComponent],
  exports: [IDLNBImageComponent],
})
export class NotebooksRenderersModule {
  constructor(private injector: Injector) {
    /**
     * Register our image component
     */
    customElements.define(
      IDL_NB_IMAGE_COMPONENT_SELECTOR,
      createCustomElement(IDLNBImageComponent, { injector: this.injector })
    );
  }
}
