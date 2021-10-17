import {LevelStorage} from '../../levels/level-storage';

describe('LevelStorage', () => {
  it('returns usable level data', () => {
    const levelStorage = new LevelStorage();
    const levelData = levelStorage.getLevelData(1);
    expect(levelData.boardAsString).toEqual('1/8,5/0,0-3,4/9x1MR20x1E9x');
  });
});
