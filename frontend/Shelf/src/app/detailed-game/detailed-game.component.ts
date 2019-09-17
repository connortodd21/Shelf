import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-detailed-game',
  templateUrl: './detailed-game.component.html',
  styleUrls: ['./detailed-game.component.scss']
})

export class DetailedGameComponent implements OnInit {
  id;

  constructor(private route: ActivatedRoute) { 
    this.route.params.subscribe( params => this.id = params.id );
  }
  ngOnInit() {
    this.getDetailedGameData();
  }
  getDetailedGameData() {
    console.log(`Getting detailed game data with the id of: ${this.id}`);
  }
}
