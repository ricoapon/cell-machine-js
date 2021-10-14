export enum Direction {
  UP = 'U', DOWN = 'D', LEFT = 'L', RIGHT = 'R'
}

export abstract class Cell {
  getDirection(): Direction {
    return undefined;
  }
}

abstract class CellWithDirection extends Cell {
  private direction: Direction;

  constructor(direction: Direction) {
    super();
    this.direction = direction;
  }

  getDirection(): Direction {
    return this.direction;
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }
}

export class Mover extends CellWithDirection { }
export class Push extends Cell { }
export class Slider extends CellWithDirection { }
export class Rotator extends Cell { }
export class Generator extends CellWithDirection { }
export class Immobile extends Cell { }
export class Enemy extends Cell { }
