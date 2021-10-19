import {Coordinate} from './coordinate';

export class RectangularArea {
    public readonly topLeftCoordinate: Coordinate;
    public readonly bottomRightCoordinate: Coordinate;

    constructor(topLeftCoordinate: Coordinate, bottomRightCoordinate: Coordinate) {
        this.topLeftCoordinate = topLeftCoordinate;
        this.bottomRightCoordinate = bottomRightCoordinate;
    }

    contains(coordinate: Coordinate): boolean {
        return this.topLeftCoordinate.x <= coordinate.x && coordinate.x <= this.bottomRightCoordinate.x &&
            this.topLeftCoordinate.y <= coordinate.y && coordinate.y <= this.bottomRightCoordinate.y;
    }
}
