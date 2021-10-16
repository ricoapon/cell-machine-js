import {Game} from '../../backend/game';
import {CanvasDrawerFacade} from './canvas-drawer-facade';
import {Board} from '../../backend/board';

/**
 * Class to make handling the canvas easier.
 */
export class CanvasPrototypeManager {
  private canvasDrawerFacade: CanvasDrawerFacade;
  private game: Game;

  constructor(canvasId: string, private gridCellSizeInPx: number, gridSideLength: number) {
    this.canvasDrawerFacade = new CanvasDrawerFacade(canvasId);
    this.canvasDrawerFacade.initializeCanvas(gridCellSizeInPx, gridSideLength);
  }

  public initializeFromString(boardAsString: string): void {
    // Determine the size of the game before reading the string.
    // A bit weird to do so, but that is just a prototype.
    const boardAsStringSplit = boardAsString.split('/');
    const size = boardAsStringSplit[1];

    const sizeMatch = size.match('^(\\d+),(\\d+)$');

    this.game = new Game(+sizeMatch[1], +sizeMatch[2]);
    this.canvasDrawerFacade.initializeCanvas(this.gridCellSizeInPx, +sizeMatch[1]);
    this.game.setBoardFromString(boardAsString);
    this.redrawBoard(this.game.getBoard());
  }

  private redrawBoard(board: Board): void {
    this.canvasDrawerFacade.clearBoard();
    for (const coordinate of this.game.getBoard().getAllCoordinates()) {
      this.canvasDrawerFacade.drawCell(this.game.getBoard().getCell(coordinate), coordinate);
    }
  }

  doStep(): void {
    this.game.doStep();
    this.redrawBoard(this.game.getBoard());
  }

  getBoardAsString(): string {
    return this.game.getBoardAsString();
  }
}
