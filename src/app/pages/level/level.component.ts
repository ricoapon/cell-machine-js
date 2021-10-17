import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CanvasPrototypeManager} from '../canvas-prototype/canvas-prototype-manager';
import {GameState} from '../../backend/game-step-algorithm';
import {LevelStorageSingleton} from '../../levels/level-storage-singleton';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
  levelId: number;
  helpText: string;
  canvasPrototypeManager: CanvasPrototypeManager;
  completedLevel = false;
  playInterval;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => this.levelId = +params.id);
    // Force route reload whenever params change, otherwise the screen will not update.
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
    const levelData = LevelStorageSingleton.instance.getLevelFromCollection('original', levelId);

    // Initialize canvas with given level.
    this.canvasPrototypeManager = new CanvasPrototypeManager('game-canvas', 50);
    this.canvasPrototypeManager.initializeFromString(levelData.boardAsString);
    this.helpText = levelData.helpText;
  }

  doStep(): void {
    const gameState = this.canvasPrototypeManager.doStep();
    this.completedLevel = (gameState === GameState.COMPLETED);
  }

  playSteps(): void {
    if (this.playInterval != null) {
      clearInterval(this.playInterval);
    }

    this.playInterval = setInterval(() => {
      const gameState = this.canvasPrototypeManager.doStep();
      if (gameState === GameState.BLOCKED || gameState === GameState.COMPLETED) {
        clearInterval(this.playInterval);
      }
      this.completedLevel = (gameState === GameState.COMPLETED);
    }, 300);
  }

  nextLevel(): void {
    // Navigate to the next level if possible. If not, go to the level selection screen.
    const nextLevelId = this.levelId + 1;
    if (!LevelStorageSingleton.instance.doesLevelExist('original', nextLevelId)) {
      this.router.navigate(['/level-selection']);
    } else {
      this.router.navigate(['/level/' + nextLevelId]);
    }
  }

  reset(): void {
    // Easy to do with just reloading the entire page!
    this.router.navigate(['/level/' + this.levelId]);
  }
}
