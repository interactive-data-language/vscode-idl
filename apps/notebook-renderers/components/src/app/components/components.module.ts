import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { ImageComponent } from './image/image.component';
import { ImageAnimatorComponent } from './image-animator/image-animator.component';

@NgModule({
  declarations: [ImageComponent, ImageAnimatorComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ImageComponent, ImageAnimatorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
