import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialCssVarsModule } from 'angular-material-css-vars';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { MaterialModule } from './material.module';
import { ProfilerModule } from './profiler/profiler.module';
import { ServicesModule } from './services/services.module';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslocoRootModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialCssVarsModule.forRoot({}),
    MaterialModule,
    ServicesModule,
    HomeModule,
    ProfilerModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
