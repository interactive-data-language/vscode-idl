import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MaterialCssVarsModule } from 'angular-material-css-vars';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import {
  IDL_NB_IMAGE_COMPONENT_SELECTOR,
  ImageComponent,
} from './components/image/image.component';
import {
  IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR,
  ImageAnimatorComponent,
} from './components/image-animator/image-animator.component';
import { FAST_FORWARD } from './icons/fast-forward';
import { FAST_REWIND } from './icons/fast-rewind';
import { PAUSE } from './icons/pause';
import { PLAY } from './icons/play';
import { SAVE } from './icons/save';
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
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  /**
   * Adds custom icons for use in material
   *
   * This has been updated to directly include the SVG content
   * instead of needing to load the SVGs via HTTP
   */
  registerIcons() {
    // icons we load
    const icons: { [key: string]: any } = {
      'fast-forward': FAST_FORWARD,
      'fast-rewind': FAST_REWIND,
      pause: PAUSE,
      play: PLAY,
      save: SAVE,
    };

    // process all of our icons
    const keys = Object.keys(icons);
    for (let i = 0; i < keys.length; i++) {
      this.matIconRegistry.addSvgIconLiteral(
        keys[i],
        this.domSanitizer.bypassSecurityTrustHtml(icons[keys[i]])
      );
    }
  }

  /**
   * When we bootstrap (i.e. start up) what do we do?
   */
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

        /**
         * Register our image animator component
         */
        if (!customElements.get(IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR)) {
          customElements.define(
            IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR,
            createCustomElement(ImageAnimatorComponent, {
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
