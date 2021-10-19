import {Board} from './board';
import {Direction, Generator, Mover, Rotator} from '../cells';
import {Coordinate} from './coordinate';

describe('backend/Board', () => {
  describe('modifying grid related methods', () => {
    const emptyBoard = new Board(2, 2);
    it('getCell() returns null if there is no cell', () => {
      expect(emptyBoard.getCell(new Coordinate(0, 0))).toBeNull();
    });

    it('getCoordinate() returns only when instance of cell on the grid is identical', () => {
      // Given a board with cells of all types.
      const board = new Board(1, 2);
      const mover = new Mover(Direction.UP);
      board.setCell(mover, new Coordinate(0, 0));
      board.setCell(new Generator(Direction.UP), new Coordinate(0, 1));

      // When and then
      expect(board.getCoordinate(new Mover(Direction.UP))).toBeNull();
      expect(board.getCoordinate(mover)).toEqual(new Coordinate(0, 0));
    });

    it('clearing cells can be done with setCell()', () => {
      const board = new Board(3, 3);
      const rotator = new Rotator();
      board.setCell(rotator, new Coordinate(1, 1));
      board.setCell(null, new Coordinate(1, 1));
      expect(board.getCoordinate(rotator)).toBeNull();
    });
  });

  describe('board operations', () => {
    it('getAllCoordinatesAndCells() returns all coordinates from left to right and then top to bottom and the related cell', () => {
      const board = new Board(2, 3);
      const mover = new Mover(Direction.UP);
      const rotator = new Rotator();
      board.setCell(mover, new Coordinate(1, 1));
      board.setCell(rotator, new Coordinate(0, 2));
      const result = board.getAllCoordinatesAndCells();
      expect(result).toHaveSize(6);
      expect(result[0]).toEqual([new Coordinate(0, 0), null]);
      expect(result[1]).toEqual([new Coordinate(1, 0), null]);
      expect(result[2]).toEqual([new Coordinate(0, 1), null]);
      expect(result[3]).toEqual([new Coordinate(1, 1), mover]);
      expect(result[4]).toEqual([new Coordinate(0, 2), rotator]);
      expect(result[5]).toEqual([new Coordinate(1, 2), null]);
    });

    it('getAllCoordinatesRightToLeftTopToBottom() returns all coordinates from right to left and then top to bottom.', () => {
      const board = new Board(2, 3);
      const result = board.getAllCoordinatesRightToLeftTopToBottom();
      expect(result).toHaveSize(6);
      expect(result[0]).toEqual(new Coordinate(1, 0));
      expect(result[1]).toEqual(new Coordinate(0, 0));
      expect(result[2]).toEqual(new Coordinate(1, 1));
      expect(result[3]).toEqual(new Coordinate(0, 1));
      expect(result[4]).toEqual(new Coordinate(1, 2));
      expect(result[5]).toEqual(new Coordinate(0, 2));
    });

    it('containsCoordinate() works correctly.', () => {
      const board = new Board(2, 3);
      expect(board.containsCoordinate(null)).toBeFalse();
      expect(board.containsCoordinate(new Coordinate(-1, 2))).toBeFalse();
      expect(board.containsCoordinate(new Coordinate(1, -2))).toBeFalse();
      expect(board.containsCoordinate(new Coordinate(0, 0))).toBeTrue();
      expect(board.containsCoordinate(new Coordinate(2, 3))).toBeFalse();
      expect(board.containsCoordinate(new Coordinate(2, 2))).toBeFalse();
      expect(board.containsCoordinate(new Coordinate(1, 3))).toBeFalse();
      expect(board.containsCoordinate(new Coordinate(1, 2))).toBeTrue();
    });

    it('getCellsWithClass() returns cells from right to left top to bottom', () => {
      // Given a board with cells of all types.
      const board = new Board(3, 3);
      const rotator1 = new Rotator();
      const rotator2 = new Rotator();
      const rotator3 = new Rotator();
      board.setCell(rotator1, new Coordinate(2, 0));
      board.setCell(rotator2, new Coordinate(1, 0));
      board.setCell(rotator3, new Coordinate(2, 1));

      // When and then
      expect(board.getCellsWithClass(Rotator)).toEqual([rotator1, rotator2, rotator3]);
    });
  });

  it('setBuildArea() and getBuildArea() works.', () => {
    const board = new Board(4, 4);
    board.setBuildArea(new Coordinate(1, 1), new Coordinate(3, 3));
    expect(board.getBuildArea().topLeftCoordinate).toEqual(new Coordinate(1, 1));
    expect(board.getBuildArea().bottomRightCoordinate).toEqual(new Coordinate(3, 3));
  });
});
