import { HttpClientModule } from '@angular/common/http';
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import {
  MaterialCssVarsModule,
  MaterialCssVarsService,
} from 'angular-material-css-vars';

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
import { FAST_FORWARD } from './icons/fast-forward';
import { FAST_REWIND } from './icons/fast-rewind';
import { PAUSE } from './icons/pause';
import { PLAY } from './icons/play';
import { SAVE } from './icons/save';
import { MaterialModule } from './material.module';
import { VSCodeRendererMessenger } from './services/vscode-renderer-messenger.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialCssVarsModule.forRoot({}),
    MaterialModule,
    ComponentsModule,
  ],
  providers: [MaterialCssVarsService, VSCodeRendererMessenger],
  bootstrap: [],
  exports: [],
})
export class AppModule implements DoBootstrap {
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private materialCssVarsService: MaterialCssVarsService
  ) {
    this.registerIcons();
    // this.updateTheme();
  }

  /**
   * Updates the theme based on current CSS variables
   */
  updateTheme() {
    // get the body element
    const body = document.body;

    // get css class list
    const classes = body.classList;

    // flag if dark mode
    const isDark = !classes.contains('vscode-light');

    // get our colors
    const accent = getComputedStyle(body).getPropertyValue(
      '--vscode-activityBarBadge-background'
    );

    // set colors/themes/properties
    this.materialCssVarsService.setDarkTheme(isDark);
    // this.materialCssVarsService.setPrimaryColor(hex);
    this.materialCssVarsService.setAccentColor(accent);
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
