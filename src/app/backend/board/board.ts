import {Cell} from '../cells';
import {Coordinate} from './coordinate';
import {BuildArea} from './build-area';

export class Board {
  public readonly width; public readonly height;
  /** Rectangular grid with corners `grid[0][0]` (top-left) and `grid[width-1][height-1]` (bottom-right). */
  private readonly grid: Cell[][];
  /** Maps cells to their coordinate. This is purely to make searching coordinates cells faster. */
  private readonly cellMap: Map<Cell, Coordinate>;
  /** The editable area of the board where the player can move around cells. */
  private buildArea: BuildArea;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = new Array<Array<Cell>>();
    this.cellMap = new Map<Cell, Coordinate>();
    for (let i = 0; i < width; i++) {
      this.grid[i] = new Array<Cell>();
    }
    this.buildArea = new BuildArea(new Coordinate(0, 0), new Coordinate(0, 0));
  }

  /**
   * Returns the cell located at the given coordinate.
   * @param coordinate The coordinate on the board.
   */
  public getCell(coordinate: Coordinate): Cell {
    const cell = this.grid[coordinate.x][coordinate.y];
    return cell !== undefined ? cell : null;
  }

  public setCell(cell: Cell, coordinate: Coordinate): void {
    // If the given cell is null, we are clearing the spot. This means we have to remove from the map instead of add.
    if (cell == null) {
      this.cellMap.delete(this.grid[coordinate.x][coordinate.y]);
    } else {
      this.cellMap.set(cell, coordinate);
    }
    this.grid[coordinate.x][coordinate.y] = cell;
  }

  /**
   * Returns a list of all coordinates that are on the board with their corresponding cell (`null` if there is no cell at the location),
   * where the order of the coordinates is from the top left to the bottom right, left to right.
   */
  public getAllCoordinatesAndCells(): Array<[Coordinate, Cell]> {
    const result = new Array<[Coordinate, Cell]>();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Make sure we set null instead of undefined.
        let cell = this.grid[x][y];
        if (cell === undefined) {
          cell = null;
        }
        result.push([new Coordinate(x, y), cell]);
      }
    }
    return result;
  }

  /**
   * Returns a list of all coordinates that are on the board, where the order of the coordinates is from the top right to the bottom left,
   * right to left.
   */
  public getAllCoordinatesRightToLeftTopToBottom(): Array<Coordinate> {
    const result = new Array<Coordinate>();
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        result.push(new Coordinate(x, y));
      }
    }
    return result;
  }

  /**
   * Returns whether the coordinate exists on the board.
   * @param coordinate The coordinate to check.
   */
  public containsCoordinate(coordinate: Coordinate): boolean {
    return coordinate != null && !(coordinate.x < 0 || coordinate.x >= this.width || coordinate.y < 0 || coordinate.y >= this.height);
  }

  /**
   * Returns a list of coordinates of all the cells that are of the given class.
   * @param cellClass The class of the cell.
   */
  public getCoordinatesOfCellsWithClass(cellClass: any): Array<Coordinate> {
    const result = new Array<Coordinate>();
    for (const [coordinate, cell] of this.getAllCoordinatesAndCells()) {
      if (cell instanceof cellClass) {
        result.push(coordinate);
      }
    }
    return result;
  }

  public getCoordinate(cell: Cell): Coordinate {
    if (!this.cellMap.has(cell)) {
      return null;
    }

    return this.cellMap.get(cell);
  }

  /**
   * Returns all cells of a given class. in the order right to left top to bottom.
   * @param cellClass The class of the cell.
   */
  public getCellsWithClass(cellClass: any): Array<Cell> {
    const result = new Array<Cell>();
    for (const coordinate of this.getAllCoordinatesRightToLeftTopToBottom()) {
      const cell = this.getCell(coordinate);
      if (cell instanceof cellClass) {
        result.push(cell);
      }
    }
    return result;
  }

  public getBuildArea(): BuildArea {
    return this.buildArea;
  }

  public setBuildArea(topLeftCoordinate: Coordinate, bottomRightCoordinate: Coordinate): void {
    this.buildArea = new BuildArea(topLeftCoordinate, bottomRightCoordinate);
  }
}

