import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-level-selection',
  templateUrl: './level-selection.component.html',
  styleUrls: ['./level-selection.component.css']
})
export class LevelSelectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  forOneToN(n: number): Array<number> {
    const result = new Array<number>();
    for (let i = 1; i <= n; i++) {
      result.push(i);
    }
    return result;
  }

}
