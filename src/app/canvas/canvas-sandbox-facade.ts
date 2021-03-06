import {CanvasDrawerFacade} from './canvas-drawer-facade';
import {Sandbox} from '../backend/sandbox';
import {Coordinate} from '../backend/board/coordinate';
import {Cell, CellWithDirection, rotateDirectionClockwise} from '../backend/cells';
import {EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';


export class CanvasSandboxFacade {
  private canvasDrawerFacade: CanvasDrawerFacade;
  private sandbox: Sandbox;
  private boardAsStringEmitter = new EventEmitter<string>();

  constructor(canvasId: string, private gridCellSizeInPx: number) {
    this.canvasDrawerFacade = new CanvasDrawerFacade(canvasId, true, (oldCoordinate, newCoordinate) => {
      this.sandbox.moveCell(oldCoordinate, newCoordinate);
      this.redrawBoard();
    });
    this.canvasDrawerFacade.initializeCanvas(gridCellSizeInPx);
  }

  public initializeFromString(boardAsString: string): void {
    this.sandbox = new Sandbox();
    this.canvasDrawerFacade.initializeCanvas(this.gridCellSizeInPx);
    this.sandbox.readBoardFromString(boardAsString);
    this.redrawBoard();
  }

  private redrawBoard(): void {
    const sandbox = this.sandbox;
    this.canvasDrawerFacade.clearBoard();
    this.canvasDrawerFacade.setSize(sandbox.getWidth(), sandbox.getHeight());
    this.canvasDrawerFacade.drawBuildArea(sandbox.getBuildArea());
    for (const [coordinate, cell] of sandbox.getAllCoordinatesAndCells()) {
      this.canvasDrawerFacade.drawCell(cell, coordinate, true);
    }
    this.boardAsStringEmitter.emit(this.sandbox.getBoardAsString());
  }

  setCell(cell: Cell, coordinate: Coordinate): void {
    this.sandbox.setCell(cell, coordinate);
    this.redrawBoard();
  }

  setBuildArea(topLeftCoordinate: Coordinate, bottomRightCoordinate: Coordinate): void {
    this.sandbox.setBuildArea(topLeftCoordinate, bottomRightCoordinate);
    this.redrawBoard();
  }

  addMouseClickCallback(callback: (coordinate: Coordinate) => void): void {
    this.canvasDrawerFacade.addMouseClickCallback(callback);
  }

  rotateCellIfItExists(coordinate: Coordinate): void {
    const cell = this.sandbox.getCell(coordinate);
    if (cell == null) {
      return;
    }
    // We only rotate the cell if it has a direction.
    if (cell instanceof CellWithDirection) {
      cell.setDirection(rotateDirectionClockwise(cell.getDirection()));
      this.redrawBoard();
    }
  }

  boardAsStringObservable(): Observable<string> {
    return this.boardAsStringEmitter.asObservable();
  }
}
