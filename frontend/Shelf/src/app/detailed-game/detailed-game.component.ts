import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GamesService } from '../games/games.service';

@Component({
  selector: 'app-detailed-game',
  templateUrl: './detailed-game.component.html',
  styleUrls: ['./detailed-game.component.scss']
})

export class DetailedGameComponent implements OnInit {
  id;

  constructor(private route: ActivatedRoute, private gamesService: GamesService) { 
    this.route.params.subscribe( params => this.id = params.id );
  }
  ngOnInit() {
    this.getDetailedGameData();
  }
  getDetailedGameData() {
    this.gamesService.getDetailedInfoAboutGame(this.id).subscribe(
      (response) => {
        // BEN TODO: MAKE IT SO THE GAME DATA IS SAVED IN THE COMPONENT
        console.log(response);
      }
    )
  }
}
