import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GamesService } from '../games/games.service';
import { COVER_BIG, SCREENSHOT_BIG } from '../constants/constants.images';

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

  constructor(private route: ActivatedRoute, private gamesService: GamesService) { 
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
        console.log(this.game);
      }
    )
  }
  getDateString(timestamp) {
    const date = new Date(timestamp * 1000);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
