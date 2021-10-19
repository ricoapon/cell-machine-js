export class Coordinate {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(otherCoordinate: Coordinate): boolean {
        if (otherCoordinate == null) {
            return false;
        }
        return this.x === otherCoordinate.x && this.y === otherCoordinate.y;
    }

    toString(): string {
        return '(' + this.x + ',' + this.y + ')';
    }
}
