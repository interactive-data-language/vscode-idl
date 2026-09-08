import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatIconRegistry } from '@angular/material/icon';
import { createApplication, DomSanitizer } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  EntryComponent,
  IDL_NB_ENTRY_COMPONENT_SELECTOR,
} from './app/components/entry/entry.component';
import {
  IDL_NB_MAP_PROPERTY_SHEET_SELECTOR,
  MapPropertySheetComponent,
} from './app/components/map/map-property-sheet/map-property-sheet.component';
import { RegisterIcons } from './app/icons/register-icons';

createApplication({
  providers: [
    provideZoneChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
  .then((appRef) => {
    const injector = appRef.injector;

    RegisterIcons(injector.get(MatIconRegistry), injector.get(DomSanitizer));

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
        createCustomElement(EntryComponent, { injector }),
      );
    }

    /**
     * Register our notebook property sheet
     *
     * This is not used right now, was for popups showing properties for
     * deck.gl objects on the map.
     *
     * If you search for the property sheet selector, you will find it
     */
    if (!customElements.get(IDL_NB_MAP_PROPERTY_SHEET_SELECTOR)) {
      customElements.define(
        IDL_NB_MAP_PROPERTY_SHEET_SELECTOR,
        createCustomElement(MapPropertySheetComponent, { injector }),
      );
    }
  })
  .catch((err) => console.error(err));
