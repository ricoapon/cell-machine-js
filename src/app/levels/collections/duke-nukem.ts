import {Collection, Level} from '../level-interfaces';

export class DukeNukem implements Collection {
  getIdentifier(): string {
    return 'duke-nukem';
  }

  getName(): string {
    return 'Duke Nukem';
  }

  getLevels(): Array<Level> {
    return [
      {
        boardAsString: '1/10,10/3,3-6,6/1E8x1E23x3GU27x1GD2x1R23x1E8x1E',
      },
      {
        boardAsString: '1/10,10/3,3-6,6/1E8x1E24x1GU11x1R6x1GL11x1MR24x1E8x1E',
      },
      {
        boardAsString: '1/10,10/3,3-6,6/1E8x1E23x1GU1MR1GD1R53x1E8x1E',
      },
    ];
  }
}
