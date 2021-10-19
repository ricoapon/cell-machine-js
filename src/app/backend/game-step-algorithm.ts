import {Board} from './board/board';
import {
  Cell,
  CellType,
  CellWithDirection,
  createCellInstanceFromString,
  determineOppositeDirection,
  Direction,
  Enemy,
  Generator,
  Mover,
  rotateDirectionClockwise,
  Rotator
} from './cells';
import {BoardSerialization} from './board/board-serialization';
import {Coordinate} from './board/coordinate';

export enum GameState {
  /* Indicates the next step will possibly make changes to the board. */
  ONGOING,
  /* Indicates the next step will not change the board, but there are still enemies. */
  BLOCKED,
  /* All enemies have been killed. */
  COMPLETED
}

/**
 * Class that manipulates the board using the set rules.
 */
export class GameStepAlgorithm {
  constructor(private board: Board) {
  }

  /**
   * Make all cells activate using their special rules. Returns the state of the game.
   */
  public doStep(): GameState {
    const beforeBoardAsString = BoardSerialization.serialize(this.board);

    // Execute all the cells step by step. Order:
    // 1. Generator (spawned cells do not activate this round!)
    // 2. Rotator (first clockwise then counter-clockwise)
    // 3. Mover
    // Within each step, we move right to left, top to bottom. This is done to be consistent.

    // 1. Generator
    for (const generator of this.board.getCellsWithClass(Generator)) {
      // It is possible for a generator to kill another generator. Make sure it is still alive before activating it.
      if (this.isCellStillAlive(generator)) {
        this.doGenerator(generator);
      }
    }

    // 2. Rotator
    for (const rotator of this.board.getCellsWithClass(Rotator)) {
      // No cells can be killed during rotation phase. No alive check needed.
      this.doRotator(rotator);
    }

    // 3. Mover
    for (const mover of this.board.getCellsWithClass(Mover)) {
      // It is possible for a mover to kill another mover. Make sure it is still alive before activating it.
      if (this.isCellStillAlive(mover)) {
        this.doMover(mover);
      }
    }

    // Set variable back to false to make sure next round all spawned cells can activate again.
    for (const [, cell] of this.board.getAllCoordinatesAndCells()) {
      if (cell != null) {
        cell.isSpawnedThisRound = false;
      }
    }

    // We are blocked if the game state before is identical to the game state after.
    const afterBoardAsString = BoardSerialization.serialize(this.board);
    if (beforeBoardAsString === afterBoardAsString) {
      return GameState.BLOCKED;
    }
    // Depending on the number of enemies, we are either ongoing (> 0 enemies) or completed (0 enemies).
    if (this.board.getCellsWithClass(Enemy).length === 0) {
      return GameState.COMPLETED;
    }
    return GameState.ONGOING;
  }

  private isCellStillAlive(cell: Cell): boolean {
    return this.board.getCoordinate(cell) != null;
  }

  private doGenerator(generator: Cell): void {
    const coordinate = this.board.getCoordinate(generator);
    if (generator.isSpawnedThisRound) {
      return;
    }

    const coordinateBehindGenerator = this.determineCoordinateInDirection(coordinate, determineOppositeDirection(generator.getDirection()));
    if (coordinateBehindGenerator == null) {
      return;
    }

    const cellToCopy = this.board.getCell(coordinateBehindGenerator);
    // We don't do anything if the cell behind the generator is empty or if it is an enemy cell.
    if (cellToCopy == null || cellToCopy instanceof Enemy) {
      return;
    }

    // We don't do anything if we cannot push the cells in front of us.
    if (!this.canPushCell(coordinate, generator.getDirection())) {
      return;
    }

    // Before copying the block into the new cell, we must move all the cells forward.
    this.pushAllCells(coordinate, generator.getDirection());

    // Now we can actually copy.
    const cellCopy = createCellInstanceFromString(cellToCopy.toString());
    cellCopy.isSpawnedThisRound = true;
    const coordinateOfCopiedCell = this.determineCoordinateInDirection(coordinate, generator.getDirection());
    this.spawnCellInCoordinate(cellCopy, coordinateOfCopiedCell);
  }

  private doMover(mover: Cell): void {
    const coordinate = this.board.getCoordinate(mover);
    if (mover.isSpawnedThisRound) {
      return;
    }

    // We don't do anything if we cannot push any cells in front of the mover.
    if (!this.canPushCell(coordinate, mover.getDirection())) {
      return;
    }

    // Push all the cells in front of it.
    this.pushAllCells(coordinate, mover.getDirection());

    // Move the mover by removing it from the old location and spawning it to the freed up coordinate.
    this.spawnCellInCoordinate(mover, this.determineCoordinateInDirection(coordinate, mover.getDirection()));
    this.board.setCell(null, coordinate);
  }

  private doRotator(rotator: Cell): void {
    const coordinate = this.board.getCoordinate(rotator);
    if (rotator.isSpawnedThisRound) {
      return;
    }

    // Locate each cell around the rotator and rotate the cells.
    for (const direction of Object.values(Direction)) {
      if (this.determineCoordinateInDirection(coordinate, direction) == null) {
        continue;
      }
      const cellToRotate = this.board.getCell(this.determineCoordinateInDirection(coordinate, direction));
      if (cellToRotate != null && cellToRotate instanceof CellWithDirection) {
        cellToRotate.setDirection(rotateDirectionClockwise(cellToRotate.getDirection()));
      }
    }
  }

  /**
   * Determine whether cells from a given coordinate can be pushed into a given direction one step (e.g. the coordinate location will become
   * empty after pushing all the cells). Returns `true` if pushing is possible, `false` if not.
   * @param coordinate
   * @param direction
   * @private
   */
  private canPushCell(coordinate: Coordinate, direction: Direction): boolean {
    // If all cells are filled until we come across an immobile cell or the end of the board, we cannot push anything).
    let loopCoordinate: Coordinate = this.determineCoordinateInDirection(coordinate, direction);

    // The specific case that the exact next cell moves off the board, we cannot push.
    if (!this.board.containsCoordinate(loopCoordinate)) {
      return false;
    }

    let loopCell = this.board.getCell(loopCoordinate);

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

      // If the next cell is an enemy, we can push.
      if (loopCell.getCellType() === CellType.ENEMY) {
        return true;
      }

      // If it is a slider, we only push it if the direction is right.
      if (loopCell.getCellType() === CellType.SLIDER &&
        loopCell.getDirection() !== direction
        && loopCell.getDirection() !== determineOppositeDirection(direction)) {
        return false;
      }

      loopCoordinate = this.determineCoordinateInDirection(loopCoordinate, direction);

      if (!this.board.containsCoordinate(loopCoordinate)) {
        return false;
      }

      loopCell = this.board.getCell(loopCoordinate);
    } while (loopCell != null);

    return true;
  }

  /**
   * Push all cells from a given coordinate into a given direction one step such that the coordinate is empty.
   * Only call this method if `canPushCell` evaluates to true.
   * @param coordinate The coordinate from which to push.
   * @param direction The direction to push to.
   * @private
   */
  private pushAllCells(coordinate: Coordinate, direction: Direction): void {
    let loopCoordinate = this.determineCoordinateInDirection(coordinate, direction);

    // In the case that the exact next cell is an enemy, we don't push anything.
    const possibleEnemyCell = this.board.getCell(loopCoordinate);
    if (possibleEnemyCell != null && possibleEnemyCell.getCellType() === CellType.ENEMY) {
      return;
    }

    let previousCell: Cell = null;
    do {
      const currentCell = previousCell;
      previousCell = this.board.getCell(loopCoordinate);

      this.spawnCellInCoordinate(currentCell, loopCoordinate);

      loopCoordinate = this.determineCoordinateInDirection(loopCoordinate, direction);

      // In the specific case that we moved over an enemy, we want to stop.
      if (previousCell != null && previousCell.getCellType() === CellType.ENEMY) {
        break;
      }
    } while (previousCell != null && this.board.containsCoordinate(loopCoordinate));
  }

  /**
   * Spawns the cell on the given coordinate. If this contains an enemy, destroy both the cell and the enemy.
   * @param cell The cell to move.
   * @param coordinate The coordinate to move to.
   * @private
   */
  private spawnCellInCoordinate(cell: Cell, coordinate: Coordinate): void {
    const cellInThatLocation = this.board.getCell(coordinate);
    if (cellInThatLocation != null && this.board.getCell(coordinate).getCellType() === CellType.ENEMY) {
      // Destroy both by setting the cell to null.
      this.board.setCell(null, coordinate);
      return;
    }
    this.board.setCell(cell, coordinate);
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
      newCoordinate = new Coordinate(coordinate.x, coordinate.y - 1);
    } else if (Direction.DOWN === direction) {
      newCoordinate = new Coordinate(coordinate.x, coordinate.y + 1);
    } else if (Direction.LEFT === direction) {
      newCoordinate = new Coordinate(coordinate.x - 1, coordinate.y);
    } else if (Direction.RIGHT === direction) {
      newCoordinate = new Coordinate(coordinate.x + 1, coordinate.y);
    }

    if (!this.board.containsCoordinate(newCoordinate)) {
      newCoordinate = null;
    }

    return newCoordinate;
  }
}
