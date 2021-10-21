import {Component, OnInit} from '@angular/core';
import {CanvasSandboxFacade} from '../../canvas/canvas-sandbox-facade';
import {createCellInstanceFromString} from '../../backend/cells';
import {Coordinate} from '../../backend/board/coordinate';

@Component({
  selector: 'app-level-creator',
  templateUrl: './level-creator.component.html',
  styleUrls: ['./level-creator.component.css']
})
export class LevelCreatorComponent implements OnInit {
  canvasSandboxFacade: CanvasSandboxFacade;
  currentBoardAsString: string;
  width: number;
  height: number;
  buildArea: string;
  onClickFunction = (_: Coordinate) => {};

  constructor() {
  }

  ngOnInit(): void {
    this.canvasSandboxFacade = new CanvasSandboxFacade('game-canvas', 50);
    this.canvasSandboxFacade.boardAsStringObservable().subscribe((boardAsString) => {
      this.currentBoardAsString = boardAsString;
    });
    this.canvasSandboxFacade.initializeFromString('1/10,10/0,0-0,0/1x');
    this.width = 10;
    this.height = 10;
    this.buildArea = '0,0-0,0';
    this.canvasSandboxFacade.addMouseClickCallback((coordinate) => {
      this.onClickFunction(coordinate);
    });
  }

  setOnClickFunctionToSpawnCell(cellAsString: string): void {
    this.onClickFunction = (coordinate) => {
      this.canvasSandboxFacade.setCell(createCellInstanceFromString(cellAsString), coordinate);
    };
  }

  setOnClickFunctionToRotate(): void {
    this.onClickFunction = (coordinate) => {
      this.canvasSandboxFacade.rotateCellIfItExists(coordinate);
    };
  }

  setOnClickFunctionToDelete(): void {
    this.onClickFunction = (coordinate) => {
      this.canvasSandboxFacade.setCell(null, coordinate);
    };
  }

  changeSize(): void {
    const size = this.width + ',' + this.height;
    this.canvasSandboxFacade.initializeFromString('1/' + size + '/0,0-0,0/1x');
  }

  changeBuildArea(): void {
    const buildAreaMatch = this.buildArea.match('^(\\d+),(\\d+)-(\\d+),(\\d+)$');
    this.canvasSandboxFacade.setBuildArea(
      new Coordinate(+buildAreaMatch[1], +buildAreaMatch[2]),
      new Coordinate(+buildAreaMatch[3], +buildAreaMatch[4]));
  }
}
