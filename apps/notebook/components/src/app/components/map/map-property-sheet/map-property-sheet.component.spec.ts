import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPropertySheetComponent } from './map-property-sheet.component';

describe('MapPropertySheetComponent', () => {
  let component: MapPropertySheetComponent;
  let fixture: ComponentFixture<MapPropertySheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapPropertySheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPropertySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
