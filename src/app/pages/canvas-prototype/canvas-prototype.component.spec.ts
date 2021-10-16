import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasPrototypeComponent } from './canvas-prototype.component';

describe('CanvasPrototypeComponent', () => {
  let component: CanvasPrototypeComponent;
  let fixture: ComponentFixture<CanvasPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasPrototypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
