import {Component, OnInit} from '@angular/core';
import {Game} from '../../backend/game';
import {Coordinate} from '../../backend/board';
import {Cell, CellType, CellWithDirection, Direction} from '../../backend/cells';

@Component({
  selector: 'app-css-grid-prototype',
  templateUrl: './css-grid-prototype.component.html',
  styleUrls: ['./css-grid-prototype.component.css']
})
export class CssGridPrototypeComponent implements OnInit {
  private game: Game;

  boardAsStringInput = '1/6,6/0,0-0,1/1x1MD4x1R29x';

  constructor() {
  }

  doStep(): void {
    this.game.doStep();
    this.boardAsStringInput = this.game.getBoardAsString();
  }

  ngOnInit(): void {
    this.initializeGame();
  }

  initializeGame(): void {
    this.game = new Game();
    this.game.readBoardFromString(this.boardAsStringInput);
  }

  getCoordinates(): Array<Coordinate> {
    return this.game.getAllCoordinates();
  }

  determineClassForCell(coordinate: Coordinate): string[] {
    const cell = this.game.getCell(coordinate);
    if (cell == null) {
      return ['bg-empty'];
    }

    const result = [];
    result.push(this.determineBackgroundClassForCell(cell));
    const directionClass = this.determineDirectionClassForCell(cell);
    if (directionClass != null) {
      result.push(directionClass);
    }
    return result;
  }

  private determineBackgroundClassForCell(cell: Cell): string {
    switch (cell.getCellType()) {
      case CellType.ENEMY:
        return 'bg-enemy';
      case CellType.GENERATOR:
        return 'bg-generator';
      case CellType.IMMOBILE:
        return 'bg-immobile';
      case CellType.MOVER:
        return 'bg-mover';
      case CellType.PUSH:
        return 'bg-push';
      case CellType.ROTATOR:
        return 'bg-rotator';
      case CellType.SLIDER:
        return 'bg-slider';
    }
  }

  private determineDirectionClassForCell(cell: Cell): string | null {
    if (!(cell instanceof CellWithDirection)) {
      return null;
    }
    switch (cell.getDirection()) {
      case Direction.UP:
        return 'rotate-up';
      case Direction.DOWN:
        return 'rotate-down';
      case Direction.LEFT:
        return 'rotate-left';
      case Direction.RIGHT:
        return 'rotate-right';
    }
  }

  determineGridSize(): any {
    return {
      'grid-template-columns': 'repeat(' + this.game.getWidth() + ', 50px)',
      'grid-template-rows': 'repeat(' + this.game.getHeight() + ', 50px)',
    };
  }
}
