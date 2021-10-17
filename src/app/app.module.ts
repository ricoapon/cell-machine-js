import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { MenuScreenComponent } from './pages/menu-screen/menu-screen.component';
import { CanvasPrototypeComponent } from './pages/canvas-prototype/canvas-prototype.component';
import {FormsModule} from '@angular/forms';
import {CanvasCellImageCreator} from './pages/canvas-prototype/canvas-cell-image-creator';

@NgModule({
  declarations: [
    AppComponent,
    MenuScreenComponent,
    CanvasPrototypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [{provide: APP_INITIALIZER, useFactory: CanvasCellImageCreator.createInitializeCanvasCellImageCreatorMethod, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
