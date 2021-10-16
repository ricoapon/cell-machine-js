import {Board, Coordinate} from './board';
import {Direction, Enemy, Generator, Immobile, Mover, Push, Rotator, Slider} from './cells';

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
});
