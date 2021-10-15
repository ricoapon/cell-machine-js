export enum Direction {
  UP = 'U', DOWN = 'D', LEFT = 'L', RIGHT = 'R'
}

export function determineDirectionBasedOnValue(value: string): Direction {
  const invertedMap = new Map(Object.keys(Direction).map(key => [Direction[key], key]));
  return Direction[invertedMap.get(value)];
}

export enum CellType {
  MOVER = 'M',
  PUSH = 'P',
  SLIDER = 'S',
  ROTATOR = 'R',
  GENERATOR = 'G',
  IMMOBILE = 'I',
  ENEMY = 'E'
}

export function determineCellTypeBasedOnValue(value: string): CellType {
  const invertedMap = new Map(Object.keys(CellType).map(key => [CellType[key], key]));
  return CellType[invertedMap.get(value)];
}

export abstract class Cell {
  abstract getCellType(): CellType;

  getDirection(): Direction {
    return undefined;
  }

  toString(): string {
    return this.getCellType().toString() + (this.getDirection() === undefined ? '' : this.getDirection().toString());
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

export class Mover extends CellWithDirection {
  getCellType(): CellType {
    return CellType.MOVER;
  }
}

export class Push extends Cell {
  getCellType(): CellType {
    return CellType.PUSH;
  }
}

export class Slider extends CellWithDirection {
  getCellType(): CellType {
    return CellType.SLIDER;
  }
}

export class Rotator extends Cell {
  getCellType(): CellType {
    return CellType.ROTATOR;
  }
}

export class Generator extends CellWithDirection {
  getCellType(): CellType {
    return CellType.GENERATOR;
  }
}

export class Immobile extends Cell {
  getCellType(): CellType {
    return CellType.IMMOBILE;
  }
}

export class Enemy extends Cell {
  getCellType(): CellType {
    return CellType.ENEMY;
  }
}
