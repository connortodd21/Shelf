import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from '../../user/user.service';
import { GamesService } from '../../games/games.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchedGames;
  queryString = '';

  constructor(private router: Router, private gamesService: GamesService,
              private userService: UserService, private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.queryString = params.search );
  }

  ngOnInit() {
  }

  private getSearchedGames() {

    console.log('searching');

    this.gamesService.getSearchedGames(this.queryString).subscribe(
      (response) => {

        this.searchedGames = response;

        this.setupGlobalRatingInfo();
        this.setupUserRatingInfo();

      }
    );
  }

  private setupGlobalRatingInfo() {
    this.gamesService.getAllGlobalRatingInfo().subscribe(
      ratingInfo => {

        let map = new Map();
        for (let i = 0; i < ratingInfo.length; i++) {
          map.set(ratingInfo[i].game_id, ratingInfo[i]);
        }


        for (let i = 0; i < this.searchedGames.length; i++) {

          let key = this.searchedGames[i].id.toString();

          if (map.has(key)) {
            let ratingInfo = map.get(key);
            this.searchedGames[i].number_of_players = ratingInfo.number_of_players;
            this.searchedGames[i].number_of_ratings = ratingInfo.number_of_ratings;
            this.searchedGames[i].total_rating_value = ratingInfo.total_rating_value;
            if (ratingInfo.number_of_ratings == 0) {
              this.searchedGames[i].globalRating = 0;
            }
            else {
              this.searchedGames[i].globalRating = ratingInfo.total_rating_value / ratingInfo.number_of_ratings;
            }

          }
          else {
            this.searchedGames[i].number_of_players = 0;
            this.searchedGames[i].number_of_ratings = 0;
            this.searchedGames[i].total_rating_value = 0;
            this.searchedGames[i].globalRating = 0;
          }
        }
      }
    )
  }


  private setupUserRatingInfo() {
    this.userService.fetchUser(localStorage.getItem('user')).subscribe(
      user => {
        console.log(user.games_rated);
        let map = new Map();
        for (let i = 0; i < user.games_rated.length; i++) {
          map.set(user.games_rated[i].game_id, user.games_rated[i].rating);
        }
        for (let i = 0; i < this.searchedGames.length; i++) {

          let key = this.searchedGames[i].id.toString();

          if (map.has(key)) {
            this.searchedGames[i].userRating = map.get(key);
          }
          else {
            this.searchedGames[i].userRating = 0;
          }
        }
        console.log(this.searchedGames)
      }
    )
  }

}
