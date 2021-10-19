import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSelectionComponent } from './collection-selection.component';

describe('CollectionSelectionComponent', () => {
  let component: CollectionSelectionComponent;
  let fixture: ComponentFixture<CollectionSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
