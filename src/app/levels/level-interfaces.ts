export interface Collection {
  getIdentifier(): string;
  getName(): string;
  getLevels(): Array<Level>;
}

export interface LevelStorage {
  getCollections(): Array<[string, string]>;
  doesLevelExist(collectionIdentifier: string, levelNumber: number): boolean;
  getNumberOfLevels(collectionIdentifier: string): number;
  getLevelFromCollection(collectionIdentifier: string, levelNumber: number): Level;
}

export type Level = {
  name?: string,
  boardAsString: string,
  helpText?: string
};
