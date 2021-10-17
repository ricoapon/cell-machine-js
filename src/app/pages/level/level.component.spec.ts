import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelComponent} from './level.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, Router} from '@angular/router';

describe('LevelComponent', () => {
  let router: Router;
  let route: ActivatedRoute;
  let component: LevelComponent;
  let fixture: ComponentFixture<LevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelComponent],
      imports: [RouterTestingModule.withRoutes([])]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

  });

  it('should create', () => {
    // TODO: figure out how to test this.
    const spyRoute = spyOn(route.snapshot.paramMap, 'get');
    spyRoute.and.returnValue('1');

    expect(component).toBeTruthy();
  });
});
