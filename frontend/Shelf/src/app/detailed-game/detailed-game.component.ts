import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../games/games.service';
import { COVER_BIG, SCREENSHOT_BIG } from '../constants/constants.images';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detailed-game',
  templateUrl: './detailed-game.component.html',
  styleUrls: ['./detailed-game.component.scss']
})

export class DetailedGameComponent implements OnInit {
  id;
  game;
  coverPath;
  screenshotPath;
  artworkUrls;
  globalRating: number;
  userRating: number;

  constructor(private route: ActivatedRoute, private gamesService: GamesService, private location: Location) {
    this.route.params.subscribe( params => this.id = params.id );
  }
  ngOnInit() {
    //if we navigated from home page, then we can save tons of time and use these

    if (history.state.userRating !== undefined && history.state.globalRating !== undefined) {
      this.globalRating = history.state.globalRating;
      this.userRating = history.state.userRating;
      this.getDetailedGameData(false);
    }
    else {
      this.getDetailedGameData(true);
    }

    this.coverPath = COVER_BIG;
    this.screenshotPath = SCREENSHOT_BIG;
  }

  getDetailedGameData(shouldFetchRatings: boolean) {
    this.gamesService.getDetailedInfoAboutGame(this.id).subscribe(
      (response) => {
        this.game = response.shift();
        this.game.release_date = this.getDateString(this.game.first_release_date);
        this.artworkUrls = [];
        this.game.artworks.forEach(artwork => {
          this.artworkUrls.push(`${SCREENSHOT_BIG}${artwork.image_id}.jpg`);
        });

        if (shouldFetchRatings) {
          this.gamesService.getGlobalRatingInfo(this.id).subscribe(
            response => {
              this.globalRating = response.total_rating_value / response.number_of_ratings;
            }
          )
        }
        this.gamesService.fetchUserRating(this.id).subscribe(
          response => {
            this.userRating = response.rating;
          }
        )
      }
    );
  }

  getDateString(timestamp) {
    const date = new Date(timestamp * 1000);
    // tslint:disable: max-line-length
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  gotoGamePage() {
    window.open(this.game.url, '_blank');
  }

  goBack() {
    this.location.back();
  }


  handleRate(event) {
    this.gamesService.submitRatingToUser(event.value, this.userRating, this.id).subscribe(
      () => {

        this.gamesService.submitRatingToGame(event.value, this.userRating, this.id).subscribe(
          () => {

            this.gamesService.getGlobalRatingInfo(this.id).subscribe(
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

}
