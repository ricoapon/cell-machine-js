import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LevelStorageSingleton} from '../../levels/level-storage-singleton';

@Component({
  selector: 'app-level-selection',
  templateUrl: './level-selection.component.html',
  styleUrls: ['./level-selection.component.css']
})
export class LevelSelectionComponent implements OnInit {
  collectionIdentifier: string;
  collectionName: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.collectionIdentifier = params.collectionIdentifier;
      this.collectionName = LevelStorageSingleton.instance.getCollectionName(this.collectionIdentifier);
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
  }

  getLevelNumbers(): Array<number> {
    const n = LevelStorageSingleton.instance.getNumberOfLevels(this.collectionIdentifier);
    const result = new Array<number>();
    for (let i = 1; i <= n; i++) {
      result.push(i);
    }
    return result;
  }
}
