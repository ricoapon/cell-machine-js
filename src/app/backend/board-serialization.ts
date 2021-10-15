import {Board, Coordinate} from './board';
import {
  Cell,
  CellType,
  determineCellTypeBasedOnValue,
  determineDirectionBasedOnValue,
  Enemy,
  Generator,
  Immobile,
  Mover,
  Push,
  Rotator,
  Slider
} from './cells';

const EMPTY_CELL_CHAR = 'x';
const SERIALIZATION_VERSION = '1';
export const BOARD_SINGLE_CELL_REGEX = /\d+(?:M[UDLR]|P|S[UDLR]|R|G[UDLR]|I|E|x)/g;
export const BOARD_CELLS_REGEX = /^(\d+(?:M[UDLR]|P|S[UDLR]|R|G[UDLR]|I|E|x))+$/;

/**
 * Class for serialization and deserialization of the board class.
 */
export class BoardSerialization {
  /**
   * Returns a string with the following format: `<version>/<width>,<height>/<build-area>/<board-cells>` where
   * `<build-area>` is of the format `<top-left-x>,<top-left-y>-<bottom-right-x>.<bottom-right-y>`
   * and `<board-cells>` like fen: a number followed by a the `string` representation of the cell.
   * @param board The board to serialize.
   */
  public static serialize(board: Board): string {
    const version = SERIALIZATION_VERSION;
    const size = board.width + ',' + board.height;
    const buildArea = board.getBuildArea().topLeftCoordinate.x + ',' + board.getBuildArea().topLeftCoordinate.y +
      '-' + board.getBuildArea().bottomRightCoordinate.x + ',' + board.getBuildArea().bottomRightCoordinate.y;

    let boardCells = '';
    let previousCellToString: string = BoardSerialization.convertCellToString(board.getCell(0, 0));
    let nrOfCellsFoundInARow = 0;
    for (const coordinate of board.getAllCoordinates()) {
      const cellToString = BoardSerialization.convertCellToString(board.getCell(coordinate));
      if (cellToString === previousCellToString) {
        nrOfCellsFoundInARow++;
      } else {
        // Append the number of cells found.
        boardCells += nrOfCellsFoundInARow.toString() + previousCellToString;

        // Reset the variables for the next cells based on the current cell.
        previousCellToString = cellToString;
        nrOfCellsFoundInARow = 1;
      }
    }
    // The final cells are not registered in the loop itself, so do one extra iteration.
    boardCells += nrOfCellsFoundInARow.toString() + previousCellToString;

    const boardAsString = version + '/' + size + '/' + buildArea + '/' + boardCells;
    if (!this.validate(boardAsString)) {
      throw new Error('The given board validated to "' + boardAsString + '", which is invalid. Please contact the admin.');
    }
    return boardAsString;
  }

  /**
   * Returns the string representation of a cell. Handles null values as well.
   * @param cell
   * @private
   */
  private static convertCellToString(cell: Cell): string {
    return cell != null ? cell.toString() : EMPTY_CELL_CHAR;
  }

  public static deserialize(boardAsString: string): Board {
    if (!this.validate(boardAsString)) {
      throw new Error('The given string "' + boardAsString + '" is invalid.');
    }

    const boardAsStringSplit = boardAsString.split('/');
    const size = boardAsStringSplit[1];
    const buildArea = boardAsStringSplit[2];
    const boardCells = boardAsStringSplit[3];

    const sizeMatch = size.match('^(\\d+),(\\d+)$');
    const board = new Board(+sizeMatch[1], +sizeMatch[2]);

    const buildAreaMatch = buildArea.match('^(\\d+),(\\d+)-(\\d+),(\\d+)$');
    board.setBuildArea(new Coordinate(+buildAreaMatch[1], +buildAreaMatch[2]), new Coordinate(+buildAreaMatch[3], +buildAreaMatch[4]));

    const boardCellsMatch = boardCells.match(BOARD_SINGLE_CELL_REGEX);
    const coordinates = board.getAllCoordinates();
    let count = 0;
    for (const cellAsString of boardCellsMatch) {
      const cellMatch = cellAsString.match(/^(\d+)(\w+)$/);
      const numberOfCells: number = +cellMatch[1];
      const cell = createCellInstanceFromString(cellMatch[2]);
      for (let i = 0; i < numberOfCells; i++) {
        board.setCell(cell, coordinates[count]);
        count++;
      }
    }

    return board;
  }

  private static createCellInstanceFromString(cell: string): Cell {
    const cellMatch = cell.match(/(\w)(\w?)/);
    const cellType = determineCellTypeBasedOnValue(cellMatch[1]);
    const direction = determineDirectionBasedOnValue(cellMatch[2]);

    if (CellType.MOVER === cellType) {
      return new Mover(direction);
    } else if (CellType.PUSH === cellType) {
      return new Push();
    } else if (CellType.SLIDER === cellType) {
      return new Slider(direction);
    } else if (CellType.ROTATOR === cellType) {
      return new Rotator();
    } else if (CellType.GENERATOR === cellType) {
      return new Generator(direction);
    } else if (CellType.IMMOBILE === cellType) {
      return new Immobile();
    } else if (CellType.ENEMY === cellType) {
      return new Enemy();
    }
  }

  /**
   * Returns whether or not the string is a valid representation of a board.
   * @param boardAsString
   * @private
   */
  private static validate(boardAsString: string): boolean {
    // To make the code easier to maintain, validate each subcomponent.
    const boardAsStringSplit = boardAsString.split('/');

    if (boardAsStringSplit.length !== 4) {
      console.log('The length after splitting does not equal 4.');
      return false;
    }

    const version = boardAsStringSplit[0];
    const size = boardAsStringSplit[1];
    const buildArea = boardAsStringSplit[2];
    const boardCells = boardAsStringSplit[3];

    if (version !== SERIALIZATION_VERSION) {
      console.log('The version is incorrect.');
      return false;
    }

    if (!size.match('^\\d+,\\d+$')) {
      console.log('The size is incorrect.');
      return false;
    }

    if (!buildArea.match('^\\d+,\\d+-\\d+,\\d+$')) {
      console.log('The build area is incorrect.');
      return false;
    }

    if (!boardCells.match(BOARD_CELLS_REGEX)) {
      console.log('The board cells are incorrect.');
      return false;
    }

    return true;
  }
}
