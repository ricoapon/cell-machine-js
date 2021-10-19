import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuScreenComponent} from './pages/menu-screen/menu-screen.component';
import {CanvasPrototypeComponent} from './pages/canvas-prototype/canvas-prototype.component';
import {LevelSelectionComponent} from './pages/level-selection/level-selection.component';
import {LevelComponent} from './pages/level/level.component';
import {CollectionSelectionComponent} from './pages/collection-selection/collection-selection.component';

const routes: Routes = [
  {path: 'collection-selection', component: CollectionSelectionComponent},
  {path: 'collection-selection/:collectionIdentifier', component: LevelSelectionComponent},
  {path: 'collection-selection/:collectionIdentifier/:levelId', component: LevelComponent},
  {path: 'canvas', component: CanvasPrototypeComponent},

  {path: '', component: MenuScreenComponent, pathMatch: 'full'},
  {path: '**', component: MenuScreenComponent, redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
