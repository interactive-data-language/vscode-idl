import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AppComponent, IDL_NB_IMAGE_COMPONENT_SELECTOR } from './app.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [],
  exports: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector, private appRef: ApplicationRef) {}

  ngDoBootstrap(): void {
    if (environment.production) {
      try {
        /**
         * Register our image component
         */
        if (!customElements.get(IDL_NB_IMAGE_COMPONENT_SELECTOR)) {
          customElements.define(
            IDL_NB_IMAGE_COMPONENT_SELECTOR,
            createCustomElement(AppComponent, {
              injector: this.injector,
            })
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      this.appRef.bootstrap(AppComponent);
    }
  }
}
