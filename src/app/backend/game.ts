import {Board, Coordinate, RectangularArea} from './board';
import {BoardSerialization} from './board-serialization';
import {GameState, GameStepAlgorithm} from './game-step-algorithm';
import {Cell} from './cells';

/**
 * The entry point of using the game. Needs to be initialized using `readBoardFromString()`.
 */
export class Game {
  private board: Board;

  constructor() {
  }

  /**
   * Make all cells activate using their special rules.
   */
  doStep(): GameState {
    return new GameStepAlgorithm(this.board).doStep();
  }

  /**
   * Override the game with the given board.
   * @param boardAsString The board represented as a string.
   */
  readBoardFromString(boardAsString: string): void {
    this.board = BoardSerialization.deserialize(boardAsString);
  }

  getBoardAsString(): string {
    return BoardSerialization.serialize(this.board);
  }

  moveCellInsideBuildArea(oldCoordinate: Coordinate, newCoordinate: Coordinate): void {
    if (!this.board.getBuildArea().contains(oldCoordinate) || !this.board.getBuildArea().contains(newCoordinate)) {
      throw new Error('Cannot move cells outside the build area');
    }

    if (this.board.getCell(oldCoordinate) == null) {
      throw new Error('Cannot move empty cells');
    }

    if (this.board.getCell(newCoordinate) != null) {
      throw new Error('Cannot move cell on top of another cell');
    }

    this.board.setCell(this.board.getCell(oldCoordinate), newCoordinate);
    this.board.setCell(null, oldCoordinate);
  }

  getCell(coordinate: Coordinate): Cell {
    return this.board.getCell(coordinate);
  }
  getAllCoordinates(): Array<Coordinate> {
    return this.board.getAllCoordinates();
  }
  getBuildArea(): RectangularArea {
    return this.board.getBuildArea();
  }
  getWidth(): number {
    return this.board.width;
  }
  getHeight(): number {
    return this.board.height;
  }
}
