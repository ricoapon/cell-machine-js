import {fabric} from 'fabric';
import {CellType} from '../../backend/cells';
import {Image} from 'fabric/fabric-impl';

/**
 * Images are loaded asynchronously. To avoid having to deal with this issue, this class will load all the images into memory.
 * We can create new images by copying the already loaded images. This class is initialized when starting up the application.
 */
export class CanvasCellImageCreator {
  private constructor() {
    this.cells = new Map<CellType, Image>();
  }

  public static readonly instance: CanvasCellImageCreator = new CanvasCellImageCreator();

  readonly cells: Map<CellType, Image>;

  public static createInitializeCanvasCellImageCreatorMethod(): () => Promise<void> {
    return () => {
      return CanvasCellImageCreator.instance.initializeImageVariables();
    };
  }

  async initializeImageVariables(): Promise<void> {
    return new Promise((resolve, reject) => {
      let count = 0;
      const loaded = () => {
        count++;
        if (count === 7) {
          resolve();
        }
      };

      this.initializeImageVariable(CellType.ENEMY, 'assets/cells/enemy.svg', loaded, reject);
      this.initializeImageVariable(CellType.GENERATOR, 'assets/cells/generator.svg', loaded, reject);
      this.initializeImageVariable(CellType.IMMOBILE, 'assets/cells/immobile.svg', loaded, reject);
      this.initializeImageVariable(CellType.MOVER, 'assets/cells/mover.svg', loaded, reject);
      this.initializeImageVariable(CellType.PUSH, 'assets/cells/push.svg', loaded, reject);
      this.initializeImageVariable(CellType.ROTATOR, 'assets/cells/rotator.svg', loaded, reject);
      this.initializeImageVariable(CellType.SLIDER, 'assets/cells/slider.svg', loaded, reject);
    });
  }

  private initializeImageVariable(cellType: CellType, url: string, callback: () => void, reject: () => void): void {
    fabric.Image.fromURL(url, (img: Image) => {
      if (img == null) {
        reject();
      }
      this.cells.set(cellType, img);
      callback();
    });
  }

  /**
   * Create image for the canvas for which you only need to set the left and top property.
   * @param cellType The type of the cell.
   * @param gridCellSizeInPx The size of the grid.
   */
  public createImage(cellType: CellType, gridCellSizeInPx: number): Image {
    const imageToClone = this.cells.get(cellType);
    if (imageToClone == null) {
      throw new Error('CanvasCellImageCreator is not yet initialized.');
    }
    const image = fabric.util.object.clone(this.cells.get(cellType));
    // Images get their own width and height. To make sure it will fit in a cell with the correct size, we need to scale.
    image.scaleToWidth(gridCellSizeInPx);
    image.scaleToHeight(gridCellSizeInPx);
    image.set({
      hasControls: false
    });
    return image;
  }
}
