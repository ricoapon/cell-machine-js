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
  gridSideLength = 6;
  canvasWidth = this.gridCellSizeInPx * this.gridSideLength;
  canvasHeight = this.gridCellSizeInPx * this.gridSideLength;

  constructor(canvasId: string) {
    this.canvas = new fabric.Canvas(canvasId, {
      selection: false,
      preserveObjectStacking: true,
    });
  }

  public initializeCanvas(gridCellSizeInPx: number, gridSideLength: number): void {
    // Inspired by https://codepen.io/Ben_Tran/pen/YYYwNL.
    this.gridCellSizeInPx = gridCellSizeInPx;
    this.gridSideLength = gridSideLength;
    this.canvasWidth = gridCellSizeInPx * gridSideLength;
    this.canvasHeight = gridCellSizeInPx * gridSideLength;
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);
    // Background color doesn't work as a property with tailwind it seems. So we have to set it manually using FabricJS.
    this.canvas.setBackgroundColor('white', () => {});

    // Create grid lines.
    for (let i = 0; i < (this.canvasWidth / this.gridCellSizeInPx); i++) {
      this.canvas.add(new fabric.Line([i * this.gridCellSizeInPx, 0, i * this.gridCellSizeInPx, this.canvasHeight],
        {type: 'line', stroke: '#000', selectable: false, hoverCursor: 'default'}));
      this.canvas.add(new fabric.Line([0, i * this.gridCellSizeInPx, this.canvasWidth, i * this.gridCellSizeInPx],
        {type: 'line', stroke: '#000', selectable: false, hoverCursor: 'default'}));
    }

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
    this.initializeCanvas(this.gridCellSizeInPx, this.gridSideLength);
  }

  public drawBuildArea(buildArea: RectangularArea): void {
    const buildAreaRect = new fabric.Rect({
      top: buildArea.topLeftCoordinate.x * this.gridCellSizeInPx,
      left: buildArea.topLeftCoordinate.y * this.gridCellSizeInPx,
      width: (buildArea.bottomRightCoordinate.x - buildArea.topLeftCoordinate.x + 1) * this.gridCellSizeInPx,
      height: (buildArea.bottomRightCoordinate.y - buildArea.topLeftCoordinate.y + 1) * this.gridCellSizeInPx,
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
    if (cell == null) {
      return;
    }
    const img = this.canvasCellCreator.createImage(cell.getCellType(), this.gridCellSizeInPx);
    img.set({
      top: coordinate.x * this.gridCellSizeInPx,
      left: coordinate.y * this.gridCellSizeInPx,
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
