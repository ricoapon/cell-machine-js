import {Board} from './board/board';
import {BoardSerialization} from './board/board-serialization';
import {Coordinate} from './board/coordinate';
import {Cell} from './cells';
import {BuildArea} from './board/build-area';

/**
 * Entry point for creating a level. Needs to be initialized using `readBoardFromString()`.
 */
export class Sandbox {
  private board: Board;

  constructor() {
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

  moveCell(oldCoordinate: Coordinate, newCoordinate: Coordinate): void {
    if (this.board.getCell(oldCoordinate) == null) {
      throw new Error('Cannot move empty cells');
    }

    if (this.board.getCell(newCoordinate) != null) {
      throw new Error('Cannot move cell on top of another cell');
    }

    this.board.setCell(this.board.getCell(oldCoordinate), newCoordinate);
    this.board.setCell(null, oldCoordinate);
  }

  setCell(cell: Cell, coordinate: Coordinate): void {
    this.board.setCell(cell, coordinate);
  }

  getCell(coordinate: Coordinate): Cell {
    return this.board.getCell(coordinate);
  }

  getAllCoordinatesAndCells(): Array<[Coordinate, Cell]> {
    return this.board.getAllCoordinatesAndCells();
  }

  setBuildArea(topLeftCoordinate: Coordinate, bottomRightCoordinate: Coordinate): void {
    this.board.setBuildArea(topLeftCoordinate, bottomRightCoordinate);
  }

  getBuildArea(): BuildArea {
    return this.board.getBuildArea();
  }

  getWidth(): number {
    return this.board.width;
  }

  getHeight(): number {
    return this.board.height;
  }

}
