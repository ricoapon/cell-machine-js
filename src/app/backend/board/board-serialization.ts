import {Board} from './board';
import {Cell, createCellInstanceFromString} from '../cells';
import {Coordinate} from './coordinate';

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
    let previousCellToString: string = BoardSerialization.convertCellToString(board.getCell(new Coordinate(0, 0)));
    let nrOfCellsFoundInARow = 0;
    for (const [, cell] of board.getAllCoordinatesAndCells()) {
      const cellToString = BoardSerialization.convertCellToString(cell);
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
    const coordinatesAndCells = board.getAllCoordinatesAndCells();
    let count = 0;
    for (const cellAsString of boardCellsMatch) {
      const cellMatch = cellAsString.match(/^(\d+)(\w+)$/);
      const numberOfCells: number = +cellMatch[1];

      for (let i = 0; i < numberOfCells; i++) {
        board.setCell(createCellInstanceFromString(cellMatch[2]), coordinatesAndCells[count][0]);
        count++;
      }
    }

    return board;
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
      console.error('The length after splitting does not equal 4.');
      return false;
    }

    const version = boardAsStringSplit[0];
    const size = boardAsStringSplit[1];
    const buildArea = boardAsStringSplit[2];
    const boardCells = boardAsStringSplit[3];

    if (version !== SERIALIZATION_VERSION) {
      console.error('The version is incorrect.');
      return false;
    }

    if (!size.match('^\\d+,\\d+$')) {
      console.error('The size is incorrect.');
      return false;
    }

    if (!buildArea.match('^\\d+,\\d+-\\d+,\\d+$')) {
      console.error('The build area is incorrect.');
      return false;
    }

    if (!boardCells.match(BOARD_CELLS_REGEX)) {
      console.error('The board cells are incorrect.');
      return false;
    }

    return true;
  }
}
