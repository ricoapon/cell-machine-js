import {Game} from '../../backend/game';
import {CanvasDrawerFacade} from './canvas-drawer-facade';

/**
 * Class to make handling the canvas easier.
 */
export class CanvasPrototypeManager {
  private canvasDrawerFacade: CanvasDrawerFacade;
  private game: Game;

  constructor(canvasId: string, private gridCellSizeInPx: number) {
    this.canvasDrawerFacade = new CanvasDrawerFacade(canvasId);
    this.canvasDrawerFacade.initializeCanvas(gridCellSizeInPx);
  }

  public initializeFromString(boardAsString: string): void {
    this.game = new Game();
    this.canvasDrawerFacade.initializeCanvas(this.gridCellSizeInPx);
    this.game.readBoardFromString(boardAsString);
    this.redrawBoard(this.game);
  }

  private redrawBoard(game: Game): void {
    this.canvasDrawerFacade.clearBoard();
    this.canvasDrawerFacade.setSize(game.getWidth(), game.getHeight());
    this.canvasDrawerFacade.drawBuildArea(game.getBuildArea());
    for (const coordinate of game.getAllCoordinates()) {
      this.canvasDrawerFacade.drawCell(game.getCell(coordinate), coordinate, game.getBuildArea().contains(coordinate));
    }
  }

  doStep(): void {
    this.game.doStep();
    this.redrawBoard(this.game);
  }

  getBoardAsString(): string {
    return this.game.getBoardAsString();
  }
}
