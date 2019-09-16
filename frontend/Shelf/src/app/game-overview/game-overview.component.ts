import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
  @Input() name: String;
}
