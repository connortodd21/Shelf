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
  comments;

  constructor(private route: ActivatedRoute, private gamesService: GamesService, private location: Location) {
    this.route.params.subscribe(params => this.id = params.id);
    this.comments = [];
  }
  ngOnInit() {
    // if we navigated from home page, then we can save tons of time and use these

    if (history.state.userRating !== undefined && history.state.globalRating !== undefined) {
      this.globalRating = history.state.globalRating;
      this.userRating = history.state.userRating;
      this.getDetailedGameData(false);
    }
    // tslint:disable: one-line
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
            // tslint:disable: no-shadowed-variable
            response => {
              this.globalRating = response.total_rating_value / response.number_of_ratings;
              let i = 0;
              response.comments.forEach(element => {
                this.comments[i] = element;
                this.comments[i].comment_id = element._id;
                i++;
              });
            }
          );
        }
        this.gamesService.fetchUserRating(this.id).subscribe(
          response => {
            this.userRating = response.rating;
          }
        );
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
            );
          }
        );
      }
    );
  }

  upvote(comment) {
    this.gamesService.upvote(comment.comment_id, this.id).then(res => {
      // window.location.reload();
    });
  }

  downvote(comment) {
    this.gamesService.downvote(comment.comment_id, this.id).then(res => {
      // window.location.reload();
    });
  }

  addComment(comment) {
    console.log(this.id)
    this.gamesService.addComment(comment, this.id).then(res => {
      // window.location.reload();
    });
  }

  deleteComment(comment) {
    this.gamesService.deleteComment(comment.comment_id, this.id).then(res => {
      // window.location.reload();
    });
  }

}
