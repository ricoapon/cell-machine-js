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
    // We will copy the actions from the old board to the new board. We will:
    // 1. Copy over all objects that do not interact with their world around them (PUSH, IMMOBILE, ENEMY, SLIDER).
    // 2. Execute cells that have interactions in the following order: MOVER, GENERATOR, ROTATOR.
    const newBoard = new Board(this.width, this.height);
    newBoard.setBuildArea(this.board.getBuildArea().topLeftCoordinate, this.board.getBuildArea().bottomRightCoordinate);
    // Step 1.
    for (const cellType of [Push, Immobile, Enemy, Slider]) {
      const coordinates = this.board.getCoordinatesOfCellsWithClass(cellType);
      for (const coordinate of coordinates) {
        newBoard.setCell(this.board.getCell(coordinate), coordinate);
      }
    }
    // Step 2.
    for (const coordinate of this.board.getCoordinatesOfCellsWithClass(Mover)) {
      this.doMover(newBoard, coordinate);
    }
    for (const coordinate of this.board.getCoordinatesOfCellsWithClass(Generator)) {
      this.doGenerator(newBoard, coordinate);
    }
    for (const coordinate of this.board.getCoordinatesOfCellsWithClass(Rotator)) {
      this.doRotator(newBoard, coordinate);
    }

    this.board = newBoard;
  }

  private doMover(newBoard: Board, coordinate: Coordinate): void {
    const mover = this.board.getCell(coordinate);

    // Before copying the block into the new cell, we must move all the cells forward (if there are any to push).
    // Depending on whether we pushed cells, we move the mover or just copy it over without moving.
    if (this.pushAllCells(newBoard, coordinate, mover.getDirection())) {
      this.moveCellToCoordinate(newBoard, mover, this.determineCoordinateInDirection(coordinate, mover.getDirection()));
    } else {
      newBoard.setCell(mover, coordinate);
    }
  }

  private doGenerator(newBoard: Board, coordinate: Coordinate): void {
    const generator = this.board.getCell(coordinate);
    newBoard.setCell(generator, coordinate);

    // Before copying the block into the new cell, we must move all the cells forward (if there are any to push).
    this.pushAllCells(newBoard, coordinate, generator.getDirection());

    const cellToCopy = this.board.getCell(
      this.determineCoordinateInDirection(coordinate, determineOppositeDirection(generator.getDirection()))
    );
    const cellCopy = createCellInstanceFromString(cellToCopy.toString());
    const coordinateOfCopiedCell = this.determineCoordinateInDirection(coordinate, generator.getDirection());
    this.moveCellToCoordinate(newBoard, cellCopy, coordinateOfCopiedCell);
  }

  private doRotator(newBoard: Board, coordinate: Coordinate): void {
    const rotator = this.board.getCell(coordinate);
    newBoard.setCell(rotator, coordinate);

    // Locate each cell around the rotator and rotate the cells.
    for (const direction of Object.values(Direction)) {
      if (this.determineCoordinateInDirection(coordinate, direction) == null) {
        continue;
      }
      const cellToRotate = newBoard.getCell(this.determineCoordinateInDirection(coordinate, direction));
      if (cellToRotate != null && cellToRotate instanceof CellWithDirection) {
        cellToRotate.setDirection(rotateDirectionClockwise(cellToRotate.getDirection()));
      }
    }
  }

  /**
   * Moves the cell to the given coordinate. If this containsCoordinate an enemy, destroy both the cell and the enemy.
   * @param newBoard The board to manipulate.
   * @param cell The cell to move.
   * @param coordinate The coordinate to move to.
   * @private
   */
  private moveCellToCoordinate(newBoard: Board, cell: Cell, coordinate: Coordinate): void {
    const cellInThatLocation = newBoard.getCell(coordinate);
    if (cellInThatLocation != null && newBoard.getCell(coordinate).getCellType() === CellType.ENEMY) {
      // Destroy both by setting the cell to null.
      newBoard.setCell(null, coordinate);
      return;
    }
    newBoard.setCell(cell, coordinate);
  }

  /**
   * Push all cells from a given coordinate into a given direction one step such that the coordinate is empty.
   * Returns `true` if cells have been pushed, `false` if pushing could not be done.
   * @param newBoard The board to manipulate.
   * @param coordinate The coordinate from which to push.
   * @param direction The direction to push to.
   * @private
   */
  private pushAllCells(newBoard: Board, coordinate: Coordinate, direction: Direction): boolean {
    // If all cells are filled until we come across an immobile cell or the end of the board, we cannot push anything).
    let loopCoordinate: Coordinate = this.determineCoordinateInDirection(coordinate, direction);

    // The specific case that the exact next cell moves off the board, we cannot push.
    if (!newBoard.containsCoordinate(loopCoordinate)) {
      return false;
    }

    let loopCell = newBoard.getCell(loopCoordinate);

    // The specific case that the exact next cell is an enemy, we don't move anything.
    // We do need to return true, since the moving was completed.
    if (loopCell != null && loopCell.getCellType() === CellType.ENEMY) {
      return true;
    }

    do {
      // If we come across an empty cell, we can move.
      if (loopCell == null) {
        break;
      }
      // If we come across an immobile cell, we know we cannot move.
      if (loopCell.getCellType() === CellType.IMMOBILE) {
        return false;
      }
      loopCoordinate = this.determineCoordinateInDirection(loopCoordinate, direction);

      if (!newBoard.containsCoordinate(loopCoordinate)) {
        return false;
      }

      loopCell = newBoard.getCell(loopCoordinate);
    } while (loopCell != null);


    // Push all the cells.
    loopCoordinate = this.determineCoordinateInDirection(coordinate, direction);
    let previousCell: Cell = null;
    do {
      const currentCell = previousCell;
      previousCell = newBoard.getCell(loopCoordinate);
      this.moveCellToCoordinate(newBoard, currentCell, loopCoordinate);

      loopCoordinate = this.determineCoordinateInDirection(loopCoordinate, direction);

      // In the specific case that we moved over an enemy, we want to stop.
      if (previousCell != null && previousCell.getCellType() === CellType.ENEMY) {
        break;
      }
    } while (previousCell != null && newBoard.containsCoordinate(loopCoordinate));
    return true;
  }

  /**
   * Returns the new coordinate after moving to a certain direction. Returns `null` if the new coordinate falls of the board.
   * @param coordinate The starting coordinate.
   * @param direction The direction to move to.
   * @private
   */
  private determineCoordinateInDirection(coordinate: Coordinate, direction: Direction): Coordinate | null {
    let newCoordinate: Coordinate;
    if (Direction.UP === direction) {
      newCoordinate = new Coordinate(coordinate.x - 1, coordinate.y);
    } else if (Direction.DOWN === direction) {
      newCoordinate = new Coordinate(coordinate.x + 1, coordinate.y);
    } else if (Direction.LEFT === direction) {
      newCoordinate = new Coordinate(coordinate.x, coordinate.y - 1);
    } else if (Direction.RIGHT === direction) {
      newCoordinate = new Coordinate(coordinate.x, coordinate.y + 1);
    }

    if (!this.board.containsCoordinate(newCoordinate)) {
      newCoordinate = null;
    }

    return newCoordinate;
  }
}
