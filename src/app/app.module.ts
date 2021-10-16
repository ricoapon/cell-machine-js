import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { MenuScreenComponent } from './pages/menu-screen/menu-screen.component';
import { CanvasPrototypeComponent } from './pages/canvas-prototype/canvas-prototype.component';
import { CssGridPrototypeComponent } from './pages/css-grid-prototype/css-grid-prototype.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuScreenComponent,
    CanvasPrototypeComponent,
    CssGridPrototypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
