import {Game} from './game';

describe('backend/Game', () => {
  function executeTestWithSingleStep(before: string, after: string): void {
    const game = new Game(6, 6);
    game.setBoardFromString(before);
    game.doStep();
    expect(game.getBoardAsString()).toEqual(after);
  }

  describe('Enemy cells', () => {
    it('move into an enemy kills the enemy.', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/14x1MR1E20x', '1/6,6/0,0-0,1/36x');
    });
  });

  describe('Mover', () => {
    it('moves other blocks away', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/14x1MR1P20x', '1/6,6/0,0-0,1/15x1MR1P19x');
    });

    it('moves when it moves a block into an enemy', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/14x1MR1P1E19x', '1/6,6/0,0-0,1/15x1MR20x');
    });

    it('cannot move after reaching the side', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/16x1MR1P18x', '1/6,6/0,0-0,1/16x1MR1P18x');
      executeTestWithSingleStep('1/6,6/0,0-0,1/17x1MR18x', '1/6,6/0,0-0,1/17x1MR18x');
    });

    it('cannot move if blocked by an immobile cell', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/16x1MR1I18x', '1/6,6/0,0-0,1/16x1MR1I18x');
    });
  });

  describe('Rotator', () => {
    it('rotates blocks around it', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/9x1SU4x1SR1R1SD4x1SL14x', '1/6,6/0,0-0,1/9x1SR4x1SD1R1SL4x1SU14x');
    });

    it('doesnt break when at the edge', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1R1SU34x', '1/6,6/0,0-0,1/1R1SR34x');
    });

    it('rotates after mover has moved', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1R1MR34x', '1/6,6/0,0-0,1/1R1x1MR33x');
      executeTestWithSingleStep('1/6,6/0,0-0,1/1x1MD4x1R29x', '1/6,6/0,0-0,1/6x1R1ML28x');
    });
  });

  describe('Generator', () => {
    it('moves blocks before generating it', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1P1GR1P33x', '1/6,6/0,0-0,1/1P1GR2P32x');
    });

    it('generates even after mover has moved away', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1MD1GR34x', '1/6,6/0,0-0,1/1x1GR1MD3x1MD29x');
    });
  });
});
