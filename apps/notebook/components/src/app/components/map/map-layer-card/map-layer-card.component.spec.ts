import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLayerCardComponent } from './map-layer-card.component';

describe('MapLayerCardComponent', () => {
  let component: MapLayerCardComponent;
  let fixture: ComponentFixture<MapLayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapLayerCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapLayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
