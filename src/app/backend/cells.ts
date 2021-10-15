export enum Direction {
  UP = 'U', DOWN = 'D', LEFT = 'L', RIGHT = 'R'
}

export function determineDirectionBasedOnValue(value: string): Direction {
  const invertedMap = new Map(Object.keys(Direction).map(key => [Direction[key], key]));
  return Direction[invertedMap.get(value)];
}

export function determineOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.RIGHT:
      return Direction.LEFT;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
  }
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

export function createCellInstanceFromString(cell: string): Cell {
  const cellMatch = cell.match(/(\w)(\w?)/);
  const cellType = determineCellTypeBasedOnValue(cellMatch[1]);
  const direction = determineDirectionBasedOnValue(cellMatch[2]);

  if (CellType.MOVER === cellType) {
    return new Mover(direction);
  } else if (CellType.PUSH === cellType) {
    return new Push();
  } else if (CellType.SLIDER === cellType) {
    return new Slider(direction);
  } else if (CellType.ROTATOR === cellType) {
    return new Rotator();
  } else if (CellType.GENERATOR === cellType) {
    return new Generator(direction);
  } else if (CellType.IMMOBILE === cellType) {
    return new Immobile();
  } else if (CellType.ENEMY === cellType) {
    return new Enemy();
  }
}
