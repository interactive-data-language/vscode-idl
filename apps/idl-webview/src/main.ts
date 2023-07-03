import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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

import { AppModule } from './app/app.module';
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
  vsCodeLink()
);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
