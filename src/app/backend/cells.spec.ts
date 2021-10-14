import {Direction, Mover, Slider} from './cells';

describe('backend/cells', () => {
  it('cells can be differentiated based on type', () => {
    const mover = new Mover(Direction.UP);
    expect(mover instanceof Mover).toBeTrue();
    expect(mover instanceof Slider).toBeFalse();
  });
});
