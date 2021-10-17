import {Collection, Level} from '../level-interfaces';

export class Intermediate implements Collection {
  getIdentifier(): string {
    return 'intermediate';
  }

  getName(): string {
    return 'Intermediate';
  }

  getLevels(): Array<Level> {
    return [
      {
        name: 'Helicopter',
        boardAsString: '1/11,7/4,0-6,7/4x2R1GL8x2P17x2E5x2E34x',
      },
    ];
  }
}
