import {Board, Coordinate} from './board';
import {Direction, Enemy, Mover} from './cells';
import {BoardSerialization} from './board-serialization';

describe('backend/board-serialization', () => {
  it('serialize() works.', () => {
    const board = new Board(3, 4);
    board.setCell(new Mover(Direction.RIGHT), 0, 0);
    board.setCell(new Mover(Direction.DOWN), 0, 1);
    board.setCell(new Mover(Direction.DOWN), 0, 2);
    board.setCell(new Enemy(), 2, 2);
    board.setCell(new Enemy(), 2, 3);
    board.setBuildArea(new Coordinate(1, 0), new Coordinate(1, 2));

    expect(BoardSerialization.serialize(board)).toEqual('1/3,4/1,0-1,2/1MR2MD7x2E');
  });

  it('deserialize() works.', () => {
    // Test deserialization by checking that the serialization of the board is identical. Since we already know the serialization works,
    // this should suffice as a test.
    const boardAsString = '1/3,4/1,0-1,2/1MR2MD7x2E';
    const board = BoardSerialization.deserialize(boardAsString);
    expect(BoardSerialization.serialize(board)).toEqual(boardAsString);
  });
});
