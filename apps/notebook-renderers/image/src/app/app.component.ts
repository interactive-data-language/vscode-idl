import { Component, Injector } from '@angular/core';

/**
 * ID for notebook image selector
 */
export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

@Component({
  selector: IDL_NB_IMAGE_COMPONENT_SELECTOR,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'notebooks';

  constructor(private injector: Injector) {
    // /**
    //  * Register our image component
    //  */
    // customElements.define(
    //   IDL_NB_IMAGE_COMPONENT_SELECTOR,
    //   createCustomElement(IDLNBImageComponent, { injector: this.injector })
    // );
  }
}
