import {Board} from './board';
import {Direction, Enemy, Generator, Immobile, Mover, Push, Rotator, Slider} from '../cells';
import {Coordinate} from './coordinate';

describe('backend/Board', () => {
  it('getCoordinatesOfCellsWithClass() returns only cells with the correct type.', () => {
    // Given a board with cells of all types.
    const board = new Board(1, 8);
    board.setCell(new Mover(Direction.UP), 0, 0);
    board.setCell(new Generator(Direction.UP), 0, 1);
    board.setCell(new Rotator(), 0, 2);
    board.setCell(new Push(), 0, 3);
    board.setCell(new Slider(Direction.UP), 0, 4);
    board.setCell(new Immobile(), 0, 5);
    board.setCell(new Enemy(), 0, 6);

    // When calling the method.
    const result = board.getCoordinatesOfCellsWithClass(Mover);

    // Then the result should only be the specified types.
    expect(result).toHaveSize(1);
    expect(result[0]).toEqual(new Coordinate(0, 0));
  });

  it('cells can be searched based on instance', () => {
    // Given a board with cells of all types.
    const board = new Board(1, 2);
    const mover = new Mover(Direction.UP);
    board.setCell(mover, 0, 0);
    board.setCell(new Generator(Direction.UP), 0, 1);

    // When and then
    expect(board.getCoordinate(new Mover(Direction.UP))).toBeNull();
    expect(board.getCoordinate(mover)).toEqual(new Coordinate(0, 0));
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

  it('getAllCoordinates() returns all coordinates from left to right and then top to bottom.', () => {
    const board = new Board(2, 3);
    const result = board.getAllCoordinates();
    expect(result).toHaveSize(6);
    expect(result[0]).toEqual(new Coordinate(0, 0));
    expect(result[1]).toEqual(new Coordinate(1, 0));
    expect(result[2]).toEqual(new Coordinate(0, 1));
    expect(result[3]).toEqual(new Coordinate(1, 1));
    expect(result[4]).toEqual(new Coordinate(0, 2));
    expect(result[5]).toEqual(new Coordinate(1, 2));
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

  it('setCell() and getSell() methods with overrides work correctly.', () => {
    const board = new Board(1, 2);
    const firstCell = new Enemy();
    const secondCell = new Immobile();
    board.setCell(firstCell, new Coordinate(0, 0));
    board.setCell(secondCell, 0, 1);
    expect(board.getCell(0, 0)).toEqual(firstCell);
    expect(board.getCell(new Coordinate(0, 1))).toEqual(secondCell);
  });

  it('setBuildArea() and getBuildArea() works.', () => {
    const board = new Board(4, 4);
    board.setBuildArea(new Coordinate(1, 1), new Coordinate(3, 3));
    expect(board.getBuildArea().topLeftCoordinate).toEqual(new Coordinate(1, 1));
    expect(board.getBuildArea().bottomRightCoordinate).toEqual(new Coordinate(3, 3));
  });

  it('setting a cell to null will not find it again', () => {
    const board = new Board(3, 3);
    const rotator = new Rotator();
    board.setCell(rotator, 0, 0);
    board.setCell(null, 0, 0);
    expect(board.getCellsWithClass(Rotator)).toHaveSize(0);
  });
});
