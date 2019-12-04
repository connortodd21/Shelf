import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { COVER_BIG } from '../constants/constants.images';
import { GamesService } from '../games/games.service';

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent {
  constructor(private router: Router, private gameService: GamesService) { }
  coverPath = COVER_BIG;

  @Input() name: string;
  // tslint:disable: variable-name
  @Input() image_id: string;
  @Input() id: string;
  @Input() globalRating: number;
  @Input() userRating: number;
  @Input() shouldDisable: boolean;

  gotoDetailedGameView() {
    this.router.navigate([`/detailed-game/${this.id}`], {state: {globalRating: this.globalRating, userRating: this.userRating }});
  }

  handleRate(event) {
    let coverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + this.image_id + ".jpg";
    this.gameService.submitRatingToUser(event.value, this.userRating, this.id, coverUrl).subscribe(
      () => {

        this.gameService.submitRatingToGame(event.value, this.userRating, this.id, this.name).subscribe(
          () => {

            this.gameService.getGlobalRatingInfo(this.id).subscribe(
              response => {
                this.globalRating = Math.floor(response.total_rating_value / response.number_of_ratings);

                if (event.value === this.userRating) {
                  this.userRating = 0;
                } else {
                  this.userRating = event.value;
                }
              }
            );
          }
        );
      }
    );
  }

}
