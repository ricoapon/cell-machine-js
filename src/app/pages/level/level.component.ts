import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CanvasPrototypeManager} from '../canvas-prototype/canvas-prototype-manager';
import {LevelStorage} from './level-storage';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
  levelId: number;
  helpText: string;
  canvasPrototypeManager: CanvasPrototypeManager;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.levelId = +params.id);
  }

  ngOnInit(): void {
    this.initialize(this.levelId);
  }

  initialize(levelId: number): void {
    // Make sure the input is actually a number. This is messed up inside tests for some reason.
    if (isNaN(Number(levelId))) {
      return;
    }
    this.levelId = levelId;
    const levelStorage = new LevelStorage();
    const levelData = levelStorage.getLevelData(levelId);

    // Initialize canvas with given level.
    this.canvasPrototypeManager = new CanvasPrototypeManager('game-canvas', 50);
    this.canvasPrototypeManager.initializeFromString(levelData.boardAsString);
    this.helpText = levelData.helpText;
  }

  doStep(): void {
    this.canvasPrototypeManager.doStep();
  }
}
