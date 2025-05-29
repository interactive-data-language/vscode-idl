import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import {
  EntryComponent,
  IDL_NB_ENTRY_COMPONENT_SELECTOR,
} from './components/entry/entry.component';
import {
  IDL_NB_MAP_PROPERTY_SHEET_SELECTOR,
  MapPropertySheetComponent,
} from './components/map/map-property-sheet/map-property-sheet.component';
import { RegisterIcons } from './icons/register-icons';
import { MaterialModule } from './material.module';
import { VSCodeRendererMessenger } from './services/vscode-renderer-messenger.service';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [],
  exports: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ComponentsModule,
  ],
  providers: [
    VSCodeRendererMessenger,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule implements DoBootstrap {
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    RegisterIcons(this.matIconRegistry, this.domSanitizer);
  }

  /**
   * When we bootstrap (i.e. start up) what do we do?
   */
  ngDoBootstrap(): void {
    // if (environment.production) {
    try {
      /**
       * Register our entry component
       *
       * DONT REGISTER ANYTHING ELSE because it creates an instance of the
       * component and screws everything up.
       *
       * We only register the items that can be accessed directly and are not
       * children of other components
       */
      if (!customElements.get(IDL_NB_ENTRY_COMPONENT_SELECTOR)) {
        customElements.define(
          IDL_NB_ENTRY_COMPONENT_SELECTOR,
          createCustomElement(EntryComponent, {
            injector: this.injector,
          })
        );
      }

      if (!customElements.get(IDL_NB_MAP_PROPERTY_SHEET_SELECTOR)) {
        customElements.define(
          IDL_NB_MAP_PROPERTY_SHEET_SELECTOR,
          createCustomElement(MapPropertySheetComponent, {
            injector: this.injector,
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
    // } else {
    //   this.appRef.bootstrap(AppComponent);
    // }
  }
}
