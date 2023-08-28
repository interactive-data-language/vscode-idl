import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialCssVarsModule } from 'angular-material-css-vars';

import { MaterialModule } from '../material.module';
import { AnimationControlsComponent } from './animation-controls/animation-controls.component';
import { EntryComponent } from './entry/entry.component';
import { ImageComponent } from './image/image.component';
import { ImageAnimatorComponent } from './image-animator/image-animator.component';
import { MapComponent } from './map/map.component';
import { MapPropertySheetComponent } from './map/map-property-sheet/map-property-sheet.component';
import { PlotComponent } from './plot/plot.component';

@NgModule({
  declarations: [
    EntryComponent,
    ImageComponent,
    ImageAnimatorComponent,
    PlotComponent,
    MapComponent,
    MapPropertySheetComponent,
    AnimationControlsComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialCssVarsModule,
    MaterialModule,
  ],
  exports: [
    EntryComponent,
    ImageComponent,
    ImageAnimatorComponent,
    PlotComponent,
    MapComponent,
    MapPropertySheetComponent,
    AnimationControlsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})
export class ComponentsModule {}
