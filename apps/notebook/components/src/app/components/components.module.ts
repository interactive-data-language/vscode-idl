import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { AnimationControlsComponent } from './animation-controls/animation-controls.component';
import { EntryComponent } from './entry/entry.component';
import { ImageComponent } from './image/image.component';
import { ImageAnimatorComponent } from './image-animator/image-animator.component';
import { MapComponent } from './map/map.component';
import { MapLayerCardComponent } from './map/map-layer-card/map-layer-card.component';
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
    MapLayerCardComponent,
  ],
  exports: [
    EntryComponent,
    ImageComponent,
    ImageAnimatorComponent,
    PlotComponent,
    MapComponent,
    MapPropertySheetComponent,
    AnimationControlsComponent,
    MapLayerCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, MaterialModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class ComponentsModule {}
