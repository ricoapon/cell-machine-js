import {fabric} from 'fabric';
import {Coordinate, RectangularArea} from '../../backend/board';
import {Cell, CellWithDirection, Direction} from '../../backend/cells';
import {CanvasCellImageCreator} from './canvas-cell-image-creator';

/**
 * Class that handles all the drawing of the canvas. Methods in this class are game-specific.
 */
export class CanvasDrawerFacade {
  readonly canvasCellCreator = CanvasCellImageCreator.instance;
  readonly canvas: fabric.Canvas;

  // Fields that could be considered an input.
  gridCellSizeInPx = 50;
  gridWidth = 6;
  gridHeight = 6;
  canvasWidth = this.gridCellSizeInPx * this.gridWidth;
  canvasHeight = this.gridCellSizeInPx * this.gridHeight;

  constructor(canvasId: string) {
    this.canvas = new fabric.Canvas(canvasId, {
      selection: false,
      preserveObjectStacking: true,
    });
  }

  public initializeCanvas(gridCellSizeInPx: number): void {
    // Inspired by https://codepen.io/Ben_Tran/pen/YYYwNL.
    this.gridCellSizeInPx = gridCellSizeInPx;
    // Background color doesn't work as a property with tailwind it seems. So we have to set it manually using FabricJS.
    this.canvas.setBackgroundColor('white', () => {});

    // Snap to grid functionality.
    this.canvas.on('object:moving', (options) => {
      options.target.set({
        left: Math.round(options.target.left / this.gridCellSizeInPx) * this.gridCellSizeInPx,
        top: Math.round(options.target.top / this.gridCellSizeInPx) * this.gridCellSizeInPx
      });
    });
  }

  public clearBoard(): void {
    // Clear everything has been drawn or added as event.
    this.canvas.clear();
    // Initialize the way we would always initialize.
    this.initializeCanvas(this.gridCellSizeInPx);
  }

  setSize(gridWidth: number, gridHeight: number): void {
    console.log('Setting size with dimension', gridWidth, gridHeight);
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.canvasWidth = this.gridCellSizeInPx * gridWidth;
    this.canvasHeight = this.gridCellSizeInPx * gridHeight;
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);

    // Draw horizontal grid lines.
    for (let i = 0; i < this.gridHeight; i++) {
      this.canvas.add(new fabric.Line([0, i * this.gridCellSizeInPx, this.canvasWidth, i * this.gridCellSizeInPx],
        {type: 'line', stroke: 'green', selectable: false, hoverCursor: 'default'}));
    }
    // Draw vertical grid lines.
    for (let i = 0; i < (this.canvasWidth / this.gridCellSizeInPx); i++) {
      this.canvas.add(new fabric.Line([i * this.gridCellSizeInPx, 0, i * this.gridCellSizeInPx, this.canvasHeight],
        {type: 'line', stroke: '#000', selectable: false, hoverCursor: 'default'}));
    }
  }

  public drawBuildArea(buildArea: RectangularArea): void {
    const buildAreaRect = new fabric.Rect({
      top: buildArea.topLeftCoordinate.x * this.gridCellSizeInPx,
      left: buildArea.topLeftCoordinate.y * this.gridCellSizeInPx,
      height: (buildArea.bottomRightCoordinate.x - buildArea.topLeftCoordinate.x + 1) * this.gridCellSizeInPx,
      width: (buildArea.bottomRightCoordinate.y - buildArea.topLeftCoordinate.y + 1) * this.gridCellSizeInPx,
      fill: 'green',
      lockMovementY: true,
      lockMovementX: true,
      hoverCursor: 'default',
      selectable: false,
    });
    this.canvas.add(buildAreaRect);
    this.canvas.sendToBack(buildAreaRect);
  }

  public drawCell(cell: Cell, coordinate: Coordinate, draggable: boolean): void {
    const coordinateAsText = new fabric.Text(coordinate.toString(), {
      left: coordinate.x * this.gridCellSizeInPx,
      top: coordinate.y * this.gridCellSizeInPx,
      fontSize: 20,
    });
    this.canvas.add(coordinateAsText);

    if (cell == null) {
      return;
    }
    const img = this.canvasCellCreator.createImage(cell.getCellType(), this.gridCellSizeInPx);
    img.set({
      left: coordinate.x * this.gridCellSizeInPx,
      top: coordinate.y * this.gridCellSizeInPx,
    });

    if (!draggable) {
      img.set({
        lockMovementY: true,
        lockMovementX: true,
        hoverCursor: 'default',
        selectable: false,
      });
    }

    img.rotate(this.determineRotationAngle(cell));
    this.canvas.add(img);
  }

  private determineRotationAngle(cell: Cell): number {
    if (cell == null || !(cell instanceof CellWithDirection)) {
      return 0;
    }
    // All images start facing to the right. Based on that, calculate the angles.
    switch (cell.getDirection()) {
      case Direction.RIGHT:
        return 0;
      case Direction.DOWN:
        return 90;
      case Direction.LEFT:
        return 180;
      case Direction.UP:
        return -90;
    }
  }
}
