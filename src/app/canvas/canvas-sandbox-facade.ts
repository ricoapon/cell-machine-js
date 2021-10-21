import {CanvasDrawerFacade} from './canvas-drawer-facade';
import {Sandbox} from '../backend/sandbox';
import {Coordinate} from '../backend/board/coordinate';
import {Cell, CellWithDirection, rotateDirectionClockwise} from '../backend/cells';

export class CanvasSandboxFacade {
  private canvasDrawerFacade: CanvasDrawerFacade;
  private sandbox: Sandbox;

  constructor(canvasId: string, private gridCellSizeInPx: number) {
    this.canvasDrawerFacade = new CanvasDrawerFacade(canvasId, (oldCoordinate, newCoordinate) => {
      this.sandbox.moveCell(oldCoordinate, newCoordinate);
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
  }

  setCell(cell: Cell, coordinate: Coordinate): void {
    this.sandbox.setCell(cell, coordinate);
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

  getBoardAsString(): string {
    return this.sandbox.getBoardAsString();
  }
}
