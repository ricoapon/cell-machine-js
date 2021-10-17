import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuScreenComponent} from './pages/menu-screen/menu-screen.component';
import {CanvasPrototypeComponent} from './pages/canvas-prototype/canvas-prototype.component';

const routes: Routes = [
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
