import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelCreatorComponent } from './level-creator.component';

describe('LevelCreatorComponent', () => {
  let component: LevelCreatorComponent;
  let fixture: ComponentFixture<LevelCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
