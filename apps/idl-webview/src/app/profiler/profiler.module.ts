import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { MaterialModule } from '../material.module';
import { ProfilerComponent } from './components/profiler/profiler.component';

@NgModule({
  declarations: [ProfilerComponent],
  imports: [CommonModule, MaterialModule, TranslocoModule],
  exports: [ProfilerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfilerModule {}
