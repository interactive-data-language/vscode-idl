import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

const modules = [
  // MatAutocompleteModule,
  // MatButtonModule,
  // MatButtonToggleModule,
  // MatCardModule,
  // MatCheckboxModule,
  // MatChipsModule,
  // MatDatepickerModule,
  // MatDialogModule,
  // MatExpansionModule,
  MatFormFieldModule,
  // MatGridListModule,
  MatIconModule,
  MatInputModule,
  // MatListModule,
  // MatMenuModule,
  // MatNativeDateModule,
  // MatPaginatorModule,
  MatProgressBarModule,
  // MatProgressSpinnerModule,
  // MatRadioModule,
  // MatRippleModule,
  // MatSelectModule,
  MatSidenavModule,
  // MatSlideToggleModule,
  // MatSliderModule,
  // MatSnackBarModule,
  MatSortModule,
  // MatStepperModule,
  MatTableModule,
  // MatTabsModule,
  // MatToolbarModule,
  // MatTooltipModule,
  // MatTreeModule,
  FormsModule,
  // ReactiveFormsModule,
  FlexLayoutModule,
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [],
})
export class MaterialModule {}
