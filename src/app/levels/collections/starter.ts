import {Collection, Level} from '../level-interfaces';

export class Starter implements Collection {
  getIdentifier(): string {
    return 'starter';
  }

  getName(): string {
    return 'Starter';
  }

  getLevels(): Array<Level> {
    return [
      {
        boardAsString: '1/8,5/0,0-3,4/9x1MR20x1E9x',
        helpText: 'Drag cells in the build area.\nPress play to run the simulation.\nDestroy the enemy cells to win.'
      },
      {
        boardAsString: '1/8,5/0,0-3,4/11x1MU10x1E2x1R14x',
        helpText: 'The rotator cell spins cells next to it.'
      },
      {
        boardAsString: '1/10,7/0,0-4,7/16x3E12x1MR19x1P8x1P9x',
        helpText: 'Most cells can be pushed by others.'
      },
      {
        boardAsString: '1/8,8/0,4-3,7/4I1E3x4I4x4I4x4I4x1R8x1ML9x1ML12x',
        helpText: 'Can you move a rotated cell?'
      },
      {
        boardAsString: '1/9,8/4,4-8,7/3x1E5I4x5I4x5I4x5I5x1R9x1ML16x1ML',
        helpText: 'Now the other way around...'
      },
      {
        boardAsString: '1/12,5/3,0-8,4/3x1ML4x1P15x1E4x2R4x1E15x1P4x1P3x',
        helpText: 'How fast can you turn around?'
      },
      {
        boardAsString: '1/13,10/0,0-4,9/26x5MU18x1E12x1E12x1E12x1E2x1R4P34x',
        helpText: 'How much cells can you rotate?'
      },
      {
        boardAsString: '1/10,3/0,0-3,2/12x1P4x3E1x1GR8x',
        helpText: 'The generator cell duplicates the cell behind it.'
      },
      {
        boardAsString: '1/13,8/0,0-9,2/1P3x1MD2x1MD11x1P59x1MR1SU8x2E13x',
        helpText: 'Some cells can only move in one direction.'
      },
      {
        boardAsString: '1/8,5/0,0-3,4/14x1E4x1GD10x1E2x1MR6x',
      },
      {
        boardAsString: '1/12,11/0,0-4,5/5x7I1SU4x7I1x2P2x7I1x1MR2x1MD7I2x1MD2x7I5x7I5x7I34x1E1x12x',
      },
      {
        boardAsString: '1/15,11/6,7-14,10/22x1E83x1E4x1P20x1P3x2E3x1GU1x1ML1P3x1P8x1P1x1P1x1P3x',
      },
      {
        boardAsString: '1/13,5/4,0-8,4/19x1GR8x1E1x1SU6x1E9x1I11x1GL5x',
      },
    ];
  }
}
