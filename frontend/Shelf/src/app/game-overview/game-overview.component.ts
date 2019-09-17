import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
  }
  @Input() name: String;
  @Input() image_id: String;
  @Input() id: String;

  gotoDetailedGameView() {
    this.router.navigate([`/detailed-game/${this.id}`]);
  }
}
