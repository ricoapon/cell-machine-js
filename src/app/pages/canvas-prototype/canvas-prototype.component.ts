import {Component, OnInit} from '@angular/core';
import {CanvasGameFacade} from '../../canvas/canvas-game-facade';

@Component({
  selector: 'app-canvas-prototype',
  templateUrl: './canvas-prototype.component.html',
  styleUrls: ['./canvas-prototype.component.css']
})
export class CanvasPrototypeComponent implements OnInit {
  canvasFacade: CanvasGameFacade;
  boardAsStringInput = '1/6,6/0,0-2,2/1x1MD2x1ML1x1R29x';
  currentBoardAsString = '1/6,6/0,0-2,2/1x1MD2x1ML1x1R29x';

  constructor() {
  }

  ngOnInit(): void {
    this.canvasFacade = new CanvasGameFacade('game-canvas', 50);
    this.initializeGame();
  }

  doStep(): void {
    this.canvasFacade.doStep();
    this.currentBoardAsString = this.canvasFacade.getBoardAsString();
  }

  initializeGame(): void {
    this.canvasFacade.initializeFromString(this.boardAsStringInput);
    this.currentBoardAsString = this.boardAsStringInput;
  }
}
