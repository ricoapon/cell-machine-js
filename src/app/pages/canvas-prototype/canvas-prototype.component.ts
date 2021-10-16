import {Component, OnInit} from '@angular/core';
import {CanvasPrototypeManager} from './canvas-prototype-manager';

@Component({
  selector: 'app-canvas-prototype',
  templateUrl: './canvas-prototype.component.html',
  styleUrls: ['./canvas-prototype.component.css']
})
export class CanvasPrototypeComponent implements OnInit {
  canvasPrototypeManager: CanvasPrototypeManager;

  constructor() {
  }

  ngOnInit(): void {
    this.canvasPrototypeManager = new CanvasPrototypeManager('game-canvas', 50, 6);
    this.canvasPrototypeManager.initializeFromString('1/6,6/0,0-0,1/1x1MD4x1R29x');
  }

  doStep(): void {
    this.canvasPrototypeManager.doStep();
  }
}
