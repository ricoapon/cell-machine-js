import {
  CellType,
  createCellInstanceFromString,
  determineCellTypeBasedOnValue,
  determineDirectionBasedOnValue,
  Direction,
  Enemy,
  Generator, Immobile,
  Mover, Push, Rotator,
  Slider
} from './cells';

describe('backend/cells', () => {
  it('cells can be differentiated based on type', () => {
    const mover = new Mover(Direction.UP);
    expect(mover instanceof Mover).toBeTrue();
    expect(mover instanceof Slider).toBeFalse();
    expect(mover.getCellType()).toEqual(CellType.MOVER);
  });

  it('cell instances can be created based on the string representation', () => {
    const cells = [new Mover(Direction.LEFT), new Push(), new Slider(Direction.DOWN), new Rotator(), new Generator(Direction.UP),
      new Immobile(), new Enemy()];
    for (const cell of cells) {
      expect(createCellInstanceFromString(cell.toString())).toEqual(cell);
    }
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
