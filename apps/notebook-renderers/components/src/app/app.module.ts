import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialCssVarsModule } from 'angular-material-css-vars';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import {
  IDL_NB_IMAGE_COMPONENT_SELECTOR,
  ImageComponent,
} from './components/image/image.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MaterialCssVarsModule.forRoot({}),
    MaterialModule,
    ComponentsModule,
  ],
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
            createCustomElement(ImageComponent, {
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
