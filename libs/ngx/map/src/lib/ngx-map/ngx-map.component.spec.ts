import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMapComponent } from './ngx-map.component';

describe('NgxMapComponent', () => {
  let component: NgxMapComponent;
  let fixture: ComponentFixture<NgxMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
