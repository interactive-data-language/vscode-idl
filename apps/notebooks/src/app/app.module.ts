import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import {
  IDL_NB_IMAGE_COMPONENT_SELECTOR,
  IDLNBImageComponent,
  NotebooksRenderersModule,
} from '@idl/notebooks/renderers';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NotebooksRenderersModule],
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
            createCustomElement(IDLNBImageComponent, {
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
