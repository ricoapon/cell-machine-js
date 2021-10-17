import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelSelectionComponent} from './level-selection.component';
import {AppRoutingModule} from '../../app-routing.module';

describe('LevelSelectionComponent', () => {
  let component: LevelSelectionComponent;
  let fixture: ComponentFixture<LevelSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelSelectionComponent],
      imports: [AppRoutingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
