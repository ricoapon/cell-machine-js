import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelSelectionComponent} from './level-selection.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, Router} from '@angular/router';

describe('LevelSelectionComponent', () => {
  let router: Router;
  let route: ActivatedRoute;
  let component: LevelSelectionComponent;
  let fixture: ComponentFixture<LevelSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelSelectionComponent],
      imports: [RouterTestingModule.withRoutes([])]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  // it('should create', () => {
  //   // TODO: figure out how to test this.
  //   const spyRoute = spyOn(route.snapshot.paramMap, 'get');
  //   spyRoute.and.returnValue('starter');
  //
  //   expect(component).toBeTruthy();
  // });
});
