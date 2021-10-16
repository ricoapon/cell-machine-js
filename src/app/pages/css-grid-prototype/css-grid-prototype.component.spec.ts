import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssGridPrototypeComponent } from './css-grid-prototype.component';

describe('CssGridPrototypeComponent', () => {
  let component: CssGridPrototypeComponent;
  let fixture: ComponentFixture<CssGridPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CssGridPrototypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CssGridPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
