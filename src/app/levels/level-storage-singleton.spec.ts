import {LevelStorageSingleton} from './level-storage-singleton';

describe('LevelStorage', () => {
  it('returns usable level data', () => {
    expect(LevelStorageSingleton.instance
      .getLevelFromCollection('starter', 1).boardAsString)
      .toEqual('1/8,5/0,0-3,4/9x1MR20x1E9x');
  });

  it('number of levels is correct', () => {
    expect(LevelStorageSingleton.instance.doesLevelExist('starter', 0)).toEqual(false);
    expect(LevelStorageSingleton.instance.doesLevelExist('starter', 20)).toEqual(false);
    expect(LevelStorageSingleton.instance.getNumberOfLevels('starter')).toEqual(13);
  });
});
