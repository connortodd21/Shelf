import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { GamesService } from '../../games/games.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
