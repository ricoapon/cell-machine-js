import {Game} from '../../backend/game';
import {CanvasDrawerFacade} from './canvas-drawer-facade';
import {GameState} from '../../backend/game-step-algorithm';

/**
 * Class to make handling the canvas easier.
 */
export class CanvasPrototypeManager {
  private canvasDrawerFacade: CanvasDrawerFacade;
  private game: Game;

  constructor(canvasId: string, private gridCellSizeInPx: number) {
    this.canvasDrawerFacade = new CanvasDrawerFacade(canvasId, (oldCoordinate, newCoordinate) => {
      this.game.moveCellInsideBuildArea(oldCoordinate, newCoordinate);
    });
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
    for (const [coordinate, cell] of game.getAllCoordinatesAndCells()) {
      this.canvasDrawerFacade.drawCell(cell, coordinate, game.getBuildArea().contains(coordinate));
    }
  }

  doStep(): GameState {
    const gameState = this.game.doStep();
    this.redrawBoard(this.game);
    return gameState;
  }

  getBoardAsString(): string {
    return this.game.getBoardAsString();
  }
}
