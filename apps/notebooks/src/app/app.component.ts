import { Component, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import {
  IDL_NB_IMAGE_COMPONENT_SELECTOR,
  IDLNBImageComponent,
} from '@idl/notebooks/renderers';

@Component({
  selector: 'idl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'notebooks';

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
