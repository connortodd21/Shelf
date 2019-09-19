import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { COVER_BIG } from '../constants/constants.images';

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit {
  constructor(private router: Router) { }
  coverPath = COVER_BIG;

  ngOnInit() {
  }
  @Input() name: String;
  @Input() image_id: String;
  @Input() id: String;
  @Input() globalRating: Number;
  @Input() userRating: Number;

  gotoDetailedGameView() {
    this.router.navigate([`/detailed-game/${this.id}`]);
  }


}
