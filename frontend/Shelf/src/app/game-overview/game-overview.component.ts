import {Component, OnInit, Input, AfterViewChecked} from '@angular/core';
import { Router } from '@angular/router';
import { COVER_BIG } from '../constants/constants.images';
import {GamesService} from "../games/games.service";

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit, AfterViewChecked {
  constructor(private router: Router, private gameService: GamesService) { }
  coverPath = COVER_BIG;

  ngOnInit() {

  }

  ngAfterViewChecked() {
    //console.log(this.userRating + " " + this.id + " " + this.globalRating)
  }

  @Input() name: string;
  @Input() image_id: string;
  @Input() id: string;
  @Input() globalRating: number;
  @Input() userRating: number;

  gotoDetailedGameView() {
    // this.router.navigate([`/detailed-game/${this.id}`]);
    this.router.navigate([`/detailed-game/${this.id}`], {state: {globalRating: this.globalRating, userRating: this.userRating }});
  }

  handleRate(event) {
    this.gameService.submitRatingToUser(event.value, this.userRating, this.id).subscribe(
      () => {

        this.gameService.submitRatingToGame(event.value, this.userRating, this.id).subscribe(
          () => {

            this.gameService.getGlobalRatingInfo(this.id).subscribe(
              response => {
                this.globalRating = response.total_rating_value / response.number_of_ratings;

                if (event.value === this.userRating) {
                  this.userRating = 0;
                }
                else {
                  this.userRating = event.value;
                }
              }
            )
          }
        )
      }
    );
  }

  // private getUserRating() {
  //   this.gameService.fetchUserRating(this.id).subscribe(
  //     res => {this.userRating = res.rating;
  //     console.log(this.userRating + " " + this.id + " " + this.globalRating)
  //       }
  //   )
  // }
}
