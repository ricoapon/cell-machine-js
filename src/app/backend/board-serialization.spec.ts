import {Board} from './board/board';
import {Direction, Enemy, Mover} from './cells';
import {BoardSerialization} from './board-serialization';
import {Coordinate} from './board/coordinate';

describe('backend/board-serialization', () => {
  it('serialize() works.', () => {
    const board = new Board(4, 3);
    board.setCell(new Mover(Direction.RIGHT), new Coordinate(0, 0));
    board.setCell(new Mover(Direction.DOWN), new Coordinate(1, 0));
    board.setCell(new Mover(Direction.DOWN), new Coordinate(2, 0));
    board.setCell(new Enemy(), new Coordinate(2, 2));
    board.setCell(new Enemy(), new Coordinate(3, 2));
    board.setBuildArea(new Coordinate(1, 0), new Coordinate(1, 2));

    expect(BoardSerialization.serialize(board)).toEqual('1/4,3/1,0-1,2/1MR2MD7x2E');
  });

  it('deserialize() works.', () => {
    // Test deserialization by checking that the serialization of the board is identical. Since we already know the serialization works,
    // this should suffice as a test.
    const boardAsString = '1/3,4/1,0-1,2/1MR2MD7x2E';
    const board = BoardSerialization.deserialize(boardAsString);
    expect(BoardSerialization.serialize(board)).toEqual(boardAsString);
  });

  it('deserialization creates different instances per cell', () => {
    const board = BoardSerialization.deserialize('1/3,1/0,0-0,1/2MR');
    const cell1 = board.getCell(new Coordinate(0, 0));
    const cell2 = board.getCell(new Coordinate(1, 0));
    expect(cell1 === cell2).toBeFalse();
  });
});
