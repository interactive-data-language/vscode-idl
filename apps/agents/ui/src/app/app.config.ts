import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ChatState } from '@idl/ngx/chat';
import { ThemeState } from '@idl/ngx/theme';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideStore } from '@ngxs/store';
import { MarkdownModule } from 'ngx-markdown';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideStore(
      [ChatState, ThemeState],
      withNgxsLoggerPlugin(),
      withNgxsReduxDevtoolsPlugin(),
    ),
    importProvidersFrom(MarkdownModule.forRoot()),
  ],
};
