import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { COVER_BIG } from '../constants/constants.images';
import {GamesService} from "../games/games.service";

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit {
  constructor(private router: Router, private gameService: GamesService) { }
  coverPath = COVER_BIG;

  ngOnInit() {

    this.getUserRating();
  }

  @Input() name: string;
  @Input() image_id: string;
  @Input() id: string;
  @Input() globalRating: number;
  userRating: number;

  gotoDetailedGameView() {
    this.router.navigate([`/detailed-game/${this.id}`]);
  }


  handleRate(event) {
    console.log(event);
    this.gameService.submitRatingToUser(event.value, this.userRating, this.id).subscribe(
      (res) => {
        console.log("submitted rating");
        this.gameService.submitRatingToGame(event.value, this.userRating, this.id).subscribe(
          (res) => {
            console.log(res);
          }
        )
      }
    );

  }

  private getUserRating() {
    this.gameService.fetchUserRating(this.id).subscribe(
      res => {this.userRating = res.rating;
      console.log(this.userRating + " " + this.id + " " + this.globalRating)}
    )
  }
}
