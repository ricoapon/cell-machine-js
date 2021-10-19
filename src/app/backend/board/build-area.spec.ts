import {BuildArea} from './build-area';
import {Coordinate} from './coordinate';

describe('BuildArea', () => {
  it('contains() method works', () => {
    const buildArea = new BuildArea(new Coordinate(2, 1), new Coordinate(4, 5));
    expect(buildArea.contains(new Coordinate(1, 2))).toBeFalse();
    expect(buildArea.contains(new Coordinate(2, 1))).toBeTrue();
    expect(buildArea.contains(new Coordinate(4, 1))).toBeTrue();
    expect(buildArea.contains(new Coordinate(2, 5))).toBeTrue();
    expect(buildArea.contains(new Coordinate(4, 5))).toBeTrue();
    expect(buildArea.contains(new Coordinate(3, 3))).toBeTrue();
  });
});
