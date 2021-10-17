import {Level, LevelStorage} from './level-interfaces';
import {Starter} from './collections/starter';
import {Intermediate} from './collections/intermediate';

export class LevelStorageSingleton implements LevelStorage {
  public static readonly instance = new LevelStorageSingleton();

  private constructor() {
  }

  // This list must be ordered in the way it needs to be shown on the screen.
  private readonly collectionsList = [
    new Starter(),
    new Intermediate()
  ];

  private readonly collectionsMap = new Map(this.collectionsList.map(collection => [collection.getIdentifier(), collection]));

  getCollections(): Array<[string, string]> {
    return this.collectionsList.map((collection) => [collection.getIdentifier(), collection.getName()]);
  }

  getCollectionName(collectionIdentifier: string): string {
    for (const collection of this.collectionsList) {
      if (collection.getIdentifier() === collectionIdentifier) {
        return collection.getName();
      }
    }
    return null;
  }

  doesLevelExist(collectionIdentifier: string, levelNumber: number): boolean {
    const collection = this.collectionsMap.get(collectionIdentifier);
    if (collection == null) {
      throw new Error('Collection with identifier ' + collectionIdentifier + ' does not exist');
    }

    return 0 < levelNumber && levelNumber <= collection.getLevels().length;
  }

  getNumberOfLevels(collectionIdentifier: string): number {
    return this.collectionsMap.get(collectionIdentifier).getLevels().length;
  }

  getLevelFromCollection(collectionIdentifier: string, levelNumber: number): Level {
    if (!this.doesLevelExist(collectionIdentifier, levelNumber)) {
      throw new Error('Cannot get level ' + levelNumber + ' from collection ' + collectionIdentifier);
    }
    return this.collectionsMap.get(collectionIdentifier).getLevels()[levelNumber - 1];
  }
}
