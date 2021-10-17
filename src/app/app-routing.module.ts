import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuScreenComponent} from './pages/menu-screen/menu-screen.component';
import {CanvasPrototypeComponent} from './pages/canvas-prototype/canvas-prototype.component';
import {LevelSelectionComponent} from './pages/level-selection/level-selection.component';
import {LevelComponent} from './pages/level/level.component';

const routes: Routes = [
  {path: 'level/:id', component: LevelComponent},
  {path: 'level-selection', component: LevelSelectionComponent},
  {path: 'canvas', component: CanvasPrototypeComponent},

  {path: '', component: MenuScreenComponent, pathMatch: 'full'},
  {path: '**', component: MenuScreenComponent, redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
