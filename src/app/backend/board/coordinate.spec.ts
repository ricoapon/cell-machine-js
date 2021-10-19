import {Coordinate} from './coordinate';

describe('Coordinate', () => {
  it('has toString() method implemented', () => {
    expect(new Coordinate(4, 3).toString()).toEqual('(4,3)');
  });

  it('has equals method for comparing coordinates', () => {
    const coordinate1 = new Coordinate(4, 3);
    const coordinate2 = new Coordinate(4, 3);
    // The reason we implemented equals() method is because equality check doesn't work.
    expect(coordinate1 === coordinate2).toBeFalse();
    expect(coordinate1.equals(coordinate2)).toBeTrue();
  });
});
