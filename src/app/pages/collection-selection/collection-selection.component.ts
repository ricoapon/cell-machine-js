import {Component, OnInit} from '@angular/core';
import {LevelStorageSingleton} from '../../levels/level-storage-singleton';

@Component({
  selector: 'app-collection-selection',
  templateUrl: './collection-selection.component.html',
  styleUrls: ['./collection-selection.component.css']
})
export class CollectionSelectionComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  collections(): Array<[string, string]> {
    return LevelStorageSingleton.instance.getCollections();
  }
}
