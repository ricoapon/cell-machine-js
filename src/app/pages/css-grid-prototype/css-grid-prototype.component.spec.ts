import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CssGridPrototypeComponent} from './css-grid-prototype.component';
import {FormsModule} from '@angular/forms';

describe('CssGridPrototypeComponent', () => {
  let component: CssGridPrototypeComponent;
  let fixture: ComponentFixture<CssGridPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CssGridPrototypeComponent],
      imports: [FormsModule]
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
