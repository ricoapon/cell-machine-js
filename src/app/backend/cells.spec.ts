import {CellType, determineCellTypeBasedOnValue, determineDirectionBasedOnValue, Direction, Enemy, Generator, Mover, Slider} from './cells';

describe('backend/cells', () => {
  it('cells can be differentiated based on type', () => {
    const mover = new Mover(Direction.UP);
    expect(mover instanceof Mover).toBeTrue();
    expect(mover instanceof Slider).toBeFalse();
    expect(mover.getCellType()).toEqual(CellType.MOVER);
  });

  it('toString() method gives cell type and optionally the direction.', () => {
    expect(new Mover(Direction.UP).toString()).toEqual('MU');
    expect(new Generator(Direction.DOWN).toString()).toEqual('GD');
    expect(new Enemy().toString()).toEqual('E');
  });

  it('CellType and Direction can be found based on the string value', () => {
    expect(determineCellTypeBasedOnValue('R')).toEqual(CellType.ROTATOR);
    expect(determineDirectionBasedOnValue('D')).toEqual(Direction.DOWN);
  });
});
