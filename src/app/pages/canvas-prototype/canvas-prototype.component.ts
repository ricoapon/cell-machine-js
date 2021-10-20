import {Component, OnInit} from '@angular/core';
import {CanvasPrototypeManager} from '../../canvas/canvas-prototype-manager';

@Component({
  selector: 'app-canvas-prototype',
  templateUrl: './canvas-prototype.component.html',
  styleUrls: ['./canvas-prototype.component.css']
})
export class CanvasPrototypeComponent implements OnInit {
  canvasPrototypeManager: CanvasPrototypeManager;
  boardAsStringInput = '1/6,6/0,0-2,2/1x1MD2x1ML1x1R29x';
  currentBoardAsString = '1/6,6/0,0-2,2/1x1MD2x1ML1x1R29x';

  constructor() {
  }

  ngOnInit(): void {
    this.canvasPrototypeManager = new CanvasPrototypeManager('game-canvas', 50);
    this.initializeGame();
  }

  doStep(): void {
    this.canvasPrototypeManager.doStep();
    this.currentBoardAsString = this.canvasPrototypeManager.getBoardAsString();
  }

  initializeGame(): void {
    this.canvasPrototypeManager.initializeFromString(this.boardAsStringInput);
    this.currentBoardAsString = this.boardAsStringInput;
  }
}
