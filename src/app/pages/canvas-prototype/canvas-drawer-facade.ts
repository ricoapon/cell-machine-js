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
  private readonly callbackOnDragAndDrop: (oldCoordinate: Coordinate, newCoordinate: Coordinate) => void;

  /**
   * Events are triggered multiple times. To prevent callback being spammed, we ignore calls with an identical argument as the previous one.
   * This variable stores the previous call.
   */
  private previousCallBackArguments: [Coordinate, Coordinate] = [null, null];

  // Fields that could be considered an input.
  gridCellSizeInPx = 50;
  gridWidth = 6;
  gridHeight = 6;
  canvasWidth = this.gridCellSizeInPx * this.gridWidth;
  canvasHeight = this.gridCellSizeInPx * this.gridHeight;
  buildArea: RectangularArea;

  constructor(canvasId: string, callbackOnDragAndDrop: (oldCoordinate: Coordinate, newCoordinate: Coordinate) => void) {
    this.callbackOnDragAndDrop = callbackOnDragAndDrop;
    this.canvas = new fabric.Canvas(canvasId, {
      selection: false,
      preserveObjectStacking: true,
    });
  }

  public initializeCanvas(gridCellSizeInPx: number): void {
    // Inspired by https://codepen.io/Ben_Tran/pen/YYYwNL.
    this.gridCellSizeInPx = gridCellSizeInPx;
    // Background color doesn't work as a property with tailwind it seems. So we have to set it manually using FabricJS.
    this.canvas.setBackgroundColor('white', () => {
    });

    this.canvas.on('object:moved', (options) => {
      const original = options.transform.original;
      const oldCoordinate = this.calculateCoordinate(original.left, original.top, original.angle);
      const target = options.target;
      const newCoordinate = this.calculateCoordinate(target.left, target.top, target.angle);

      if (oldCoordinate.equals(newCoordinate) || !this.buildArea.contains(newCoordinate)) {
        // The square has moved, so drag it back into its old position.
        const oldLeftTop = this.calculateAngledLeftTop(oldCoordinate, options.target.angle);
        options.target.set({
          left: oldLeftTop[0],
          top: oldLeftTop[1],
        });

        // There is some weird fabric bug that you can keep dragging a block where it is not draggable. Setting the zoom 'resets' the canvas
        // dragging part. This fixes the issue. To reproduce without this line: drag a square outside the build area. Keep the mouse inside
        // the same place, the cell snaps back. Without having moved the mouse, you should see a drag pointer. You can still drag when you
        // click.
        this.canvas.setZoom(1);

        return;
      }

      if (oldCoordinate.equals(this.previousCallBackArguments[0]) && newCoordinate.equals(this.previousCallBackArguments[1])) {
        return;
      }

      // Place the square in the actual grid.
      const newLeftTop = this.calculateAngledLeftTop(newCoordinate, options.target.angle);
      options.target.set({
        left: newLeftTop[0],
        top: newLeftTop[1],
      });

      this.callbackOnDragAndDrop(oldCoordinate, newCoordinate);
      this.previousCallBackArguments = [oldCoordinate, newCoordinate];
    });
  }

  private calculateCoordinate(left: number, top: number, angle: number): Coordinate {
    // Because of the angle, left and top are skewed. Fix this by creating a rectangle in memory and rotating it back.
    const boundaryRect = new fabric.Rect({left, top, angle, width: this.gridCellSizeInPx, height: this.gridCellSizeInPx});
    boundaryRect.rotate(0);
    // Add a rounding, because weirdly enough it might be slightly off (99 instead of 100).
    return new Coordinate(Math.round(boundaryRect.left / this.gridCellSizeInPx), Math.round(boundaryRect.top / this.gridCellSizeInPx));
  }

  /**
   * Returns the left and top for a cell on a given coordinate that is rotated with given angle.
   * @param coordinate The coordinate to place the cell.
   * @param angle The angle of the cell.
   * @private
   */
  private calculateAngledLeftTop(coordinate: Coordinate, angle: number): [number, number] {
    const boundaryRect = new fabric.Rect({
      left: coordinate.x * this.gridCellSizeInPx,
      top: coordinate.y * this.gridCellSizeInPx,
      angle: 0, width: this.gridCellSizeInPx,
      height: this.gridCellSizeInPx
    });
    boundaryRect.rotate(angle);
    return [boundaryRect.left, boundaryRect.top];
  }

  public clearBoard(): void {
    // Clear everything has been drawn or added as event.
    this.canvas.clear();
    // Initialize the way we would always initialize.
    this.initializeCanvas(this.gridCellSizeInPx);
  }

  setSize(gridWidth: number, gridHeight: number): void {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.canvasWidth = this.gridCellSizeInPx * gridWidth;
    this.canvasHeight = this.gridCellSizeInPx * gridHeight;
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);

    // Draw horizontal grid lines.
    for (let i = 0; i < this.gridHeight; i++) {
      this.canvas.add(new fabric.Line([0, i * this.gridCellSizeInPx, this.canvasWidth, i * this.gridCellSizeInPx],
        {type: 'line', stroke: '#000', selectable: false, hoverCursor: 'default'}));
    }
    // Draw vertical grid lines.
    for (let i = 0; i < (this.canvasWidth / this.gridCellSizeInPx); i++) {
      this.canvas.add(new fabric.Line([i * this.gridCellSizeInPx, 0, i * this.gridCellSizeInPx, this.canvasHeight],
        {type: 'line', stroke: '#000', selectable: false, hoverCursor: 'default'}));
    }
  }

  public drawBuildArea(buildArea: RectangularArea): void {
    this.buildArea = buildArea;
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
