import {Board, Coordinate} from './board';
import {
  Cell,
  CellType,
  CellWithDirection,
  createCellInstanceFromString,
  determineOppositeDirection,
  Direction,
  Enemy,
  Generator,
  Immobile,
  Mover,
  Push,
  rotateDirectionClockwise,
  Rotator,
  Slider
} from './cells';
import {BoardSerialization} from './board-serialization';
import {GameStepAlgorithm} from './game-step-algorithm';

export class Game {
  private readonly width;
  private readonly height;
  private board: Board;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new Board(width, height);
  }

  public getBoard(): Board {
    return this.board;
  }

  public getBoardAsString(): string {
    return BoardSerialization.serialize(this.board);
  }

  public setBoardFromString(boardAsString: string): void {
    this.board = BoardSerialization.deserialize(boardAsString);
  }

  /**
   * Make all cells activate using their special rules.
   */
  public doStep(): void {
    new GameStepAlgorithm(this.board).doStep();
  }
}
