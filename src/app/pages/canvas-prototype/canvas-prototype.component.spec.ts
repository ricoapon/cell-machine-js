import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CanvasPrototypeComponent} from './canvas-prototype.component';
import {CanvasCellImageCreator} from '../../canvas/canvas-cell-image-creator';
import {FormsModule} from '@angular/forms';

beforeAll(async () => {
  // The initialize method returns a method to initialize, so we need to actually call it.
  await CanvasCellImageCreator.createInitializeCanvasCellImageCreatorMethod().call(null);
});

describe('CanvasPrototypeComponent', () => {
  let component: CanvasPrototypeComponent;
  let fixture: ComponentFixture<CanvasPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanvasPrototypeComponent],
      imports: [FormsModule]
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
