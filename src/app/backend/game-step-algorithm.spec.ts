import {GameState, GameStepAlgorithm} from './game-step-algorithm';
import {BoardSerialization} from './board-serialization';

describe('backend/GameStepAlgorithm', () => {
  function executeTestWithSingleStep(before: string, after: string): GameState {
    const board = BoardSerialization.deserialize(before);
    const gameStepAlgorithm = new GameStepAlgorithm(board);
    const gameState = gameStepAlgorithm.doStep();
    expect(BoardSerialization.serialize(board)).toEqual(after);
    return gameState;
  }

  describe('Enemy cells', () => {
    it('move into an enemy kills the enemy', () => {
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

    it('cannot move if blocked by a mover that is next to the edge', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/6x2ML28x', '1/6,6/0,0-0,1/6x2ML28x');
    });

    it('will not give execute if it was pushed into an enemy by another mover', () => {
      executeTestWithSingleStep('1/3,3/0,0-2,2/1E2ML6x', '1/3,3/0,0-2,2/1x1ML7x');
    });
  });

  describe('Rotator', () => {
    it('rotates blocks around it', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/9x1SU4x1SR1R1SD4x1SL14x', '1/6,6/0,0-0,1/9x1SR4x1SD1R1SL4x1SU14x');
    });

    it('doesnt break when at the edge', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1R1SU34x', '1/6,6/0,0-0,1/1R1SR34x');
    });

    it('rotates before mover has moved', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1R1MR34x', '1/6,6/0,0-0,1/1R6x1MD28x');
      executeTestWithSingleStep('1/6,6/0,0-0,1/1x1MD4x1R29x', '1/6,6/0,0-0,1/6x1R1MD28x');
    });
  });

  describe('Generator', () => {
    it('will not do anything if block behind it is empty or does not exist', () => {
      // Generator next to an edge.
      executeTestWithSingleStep('1/2,2/0,0-0,1/3x1GU', '1/2,2/0,0-0,1/3x1GU');
      // Generator with an empty block behind it.
      executeTestWithSingleStep('1/3,3/0,0-0,1/3x1GU5x', '1/3,3/0,0-0,1/3x1GU5x');
    });

    it('cannot generate enemies', () => {
      executeTestWithSingleStep('1/3,3/0,0-2,2/1E1GR7x', '1/3,3/0,0-2,2/1E1GR7x');
    });

    it('moves blocks before generating it', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1P1GR1P33x', '1/6,6/0,0-0,1/1P1GR2P32x');
    });

    it('generates even after mover has moved away', () => {
      executeTestWithSingleStep('1/6,6/0,0-0,1/1MD1GR34x', '1/6,6/0,0-0,1/1x1GR1MD3x1MD29x');
    });

    it('moves blocks into enemies', () => {
      // Hit an enemy directly.
      executeTestWithSingleStep('1/10,3/0,0-3,2/12x1P1GR3E13x', '1/10,3/0,0-3,2/12x1P1GR1x2E13x');
      // Hit enemy after few blocks.
      executeTestWithSingleStep('1/10,3/0,0-3,2/12x1P1GR3P3E10x', '1/10,3/0,0-3,2/12x1P1GR3P1x2E10x');
    });

    it('will not give execute if it was pushed into an enemy by another generator', () => {
      executeTestWithSingleStep('1/4,3/0,0-2,2/1E2GL1P8x', '1/4,3/0,0-2,2/1x1P1GL1P8x');
    });
  });

  describe('Slider', () => {
    it('can be pushed in the direction and opposite direction', () => {
      executeTestWithSingleStep('1/5,3/0,0-4,2/5x1MR1SL1SR7x', '1/5,3/0,0-4,2/6x1MR1SL1SR6x');
      executeTestWithSingleStep('1/3,5/0,0-2,4/4x1MD2x1SU2x1SD4x', '1/3,5/0,0-2,4/7x1MD2x1SU2x1SD1x');
    });

    it('cannot be pushed in a direction orthogonal of its direction', () => {
      executeTestWithSingleStep('1/5,3/0,0-4,2/5x1MR1SU1SD7x', '1/5,3/0,0-4,2/5x1MR1SU1SD7x');
      executeTestWithSingleStep('1/3,5/0,0-2,4/4x1MD2x1SL2x1SR4x', '1/3,5/0,0-2,4/4x1MD2x1SL2x1SR4x');
    });
  });

  describe('GameState', () => {
    it('is blocked when nothing can move', () => {
      const gameState = executeTestWithSingleStep('1/6,6/0,0-2,2/5x1MR1SD4x1MR1GD5x1SD5x1SD5x1SD5x', '1/6,6/0,0-2,2/5x1MR1SD4x1MR1GD5x1SD5x1SD5x1SD5x');
      expect(gameState).toEqual(GameState.BLOCKED);
    });

    it('is completed when all enemies have been destroyed', () => {
      const gameState = executeTestWithSingleStep('1/8,5/0,0-3,4/29x1MR1E9x', '1/8,5/0,0-3,4/40x');
      expect(gameState).toEqual(GameState.COMPLETED);
    });

    it('is ongoing when not blocked and not completed', () => {
      const gameState = executeTestWithSingleStep('1/8,5/0,0-3,4/9x1MR20x1E9x', '1/8,5/0,0-3,4/10x1MR19x1E9x');
      expect(gameState).toEqual(GameState.ONGOING);
    });
  });
});
