export type LevelData = {
  boardAsString: string,
  helpText: string
};

export class LevelStorage {
  private readonly levelDataMap = new Map([
    [1, {
      boardAsString: '1/8,5/0,0-3,4/9x1MR20x1E9x',
      helpText: 'Drag cells in the build area.\nPress play to run the simulation.\nDestroy the enemy cells to win.'
    }],
    [2, {
      boardAsString: '1/10,7/0,0-4,7/16x3E12x1MR19x1P8x1P9x',
      helpText: 'Most cells can be pushed by others.'
    }],
    [3, {
      boardAsString: '1/8,5/0,0-3,4/11x1MU10x1E2x1R14x',
      helpText: 'The rotator cell spins cells next to it.'
    }],
    [4, {
      boardAsString: '1/10,3/0,0-3,2/12x1P4x3E1x1GR8x',
      helpText: 'The generator cell duplicates the cell behind it.'
    }],
  ]);

  getLevelData(id: number): LevelData {
    return this.levelDataMap.get(id);
  }
}
