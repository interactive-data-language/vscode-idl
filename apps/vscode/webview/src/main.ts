import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideVSCodeDesignSystem,
  vsCodeButton,
  vsCodeLink,
  vsCodePanels,
  vsCodePanelTab,
  vsCodePanelView,
  vsCodeTag,
  vsCodeTextArea,
  vsCodeTextField,
} from '@vscode/webview-ui-toolkit';
import { MaterialCssVarsModule } from 'angular-material-css-vars';

import { AppComponent } from './app/app.component';
import { TranslocoRootModule } from './app/transloco-root.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// DONT USE THIS - it doesnt work. have to use individual components
// provideVSCodeDesignSystem().register(allComponents.register());

/**
 * Register buttons
 */
provideVSCodeDesignSystem().register(
  vsCodeButton(),
  vsCodeTag(),
  vsCodeTextArea(),
  vsCodeTextField(),
  vsCodePanels(),
  vsCodePanelTab(),
  vsCodePanelView(),
  vsCodeLink(),
);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(MaterialCssVarsModule.forRoot({}), TranslocoRootModule),
  ],
}).catch((err) => console.error(err));
