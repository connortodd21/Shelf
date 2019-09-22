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

  constructor(private route: ActivatedRoute, private gamesService: GamesService, private location: Location) {
    this.route.params.subscribe( params => this.id = params.id );
  }
  ngOnInit() {
    this.getDetailedGameData();
    this.coverPath = COVER_BIG;
    this.screenshotPath = SCREENSHOT_BIG;
  }

  getDetailedGameData() {
    this.gamesService.getDetailedInfoAboutGame(this.id).subscribe(
      (response) => {
        this.game = response.shift();
        this.game.release_date = this.getDateString(this.game.first_release_date);
        this.artworkUrls = [];
        this.game.artworks.forEach(artwork => {
          this.artworkUrls.push(`${SCREENSHOT_BIG}${artwork.image_id}.jpg`);
        });
        this.gamesService.getRatingInfo(this.id).subscribe(
          response => {
            this.globalRating = response.total_rating_value / response.number_of_ratings;
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
    console.log(event);
    // this.gamesService.submitRating(event.value, this.id).subscribe(
    //   (res) => {
    //     console.log("submitted rating");
    //     console.log(res);
    //   }
    // );

  }

}
