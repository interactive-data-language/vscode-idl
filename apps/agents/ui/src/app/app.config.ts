import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import { ElectronConfigService } from '@idl/ngx/app-config';
import {
  AppStorageService,
  chatMarkdownFactory,
  ChatState,
} from '@idl/ngx/chat';
import { ThemeState } from '@idl/ngx/theme';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideStore } from '@ngxs/store';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(ElectronConfigService).init()),
    provideAppInitializer(() => inject(AppStorageService).init()),
    provideRouter(appRoutes, withHashLocation()),

    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(
      [ChatState, ThemeState],
      withNgxsLoggerPlugin(),
      withNgxsReduxDevtoolsPlugin(),
    ),
    importProvidersFrom(
      MarkdownModule.forRoot({
        markedOptions: {
          provide: MARKED_OPTIONS,
          useFactory: chatMarkdownFactory,
        },
      }),
    ),
  ],
};
