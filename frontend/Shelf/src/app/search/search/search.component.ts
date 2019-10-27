import { Component, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { GamesService } from '../../games/games.service';
import { SelectItem} from 'primeng/api';
import { NO_SORT, STAR_SORT_ASC, STAR_SORT_DESC } from './search.constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchedGames;
  queryString = '';
  sortingOptions: SelectItem[];
  selectedSortingOption = NO_SORT;

  constructor(private router: Router, private gamesService: GamesService,
              private userService: UserService) {

  }

  ngOnInit() {
    this.setSortingOptions();

    this.router.events.subscribe((evt) => {
        if (evt instanceof ResolveEnd && evt.url.split('/')[1] === 'search') {
          this.queryString = evt.url.split('/')[2];
          this.getSearchedGames();
        }
      });

  }

  private gotoSearchWithQuery() {
    // this.router.navigate([`/search/${this.queryString}`]);
    this.getSearchedGames();
  }

  public getSearchedGames() {
    this.gamesService.getSearchedGames(this.queryString, this.selectedSortingOption).subscribe(
      (response) => {
        this.searchedGames = response;
        this.setupGlobalRatingInfo(() => {
          if (this.selectedSortingOption === STAR_SORT_ASC) {
            this.searchedGames.sort(this.sortAsc);
          }
          if (this.selectedSortingOption === STAR_SORT_DESC) {
            this.searchedGames.sort(this.sortDec);
          }
        });
        this.setupUserRatingInfo();

        //this.router.navigate(['/search/' + this.queryString]);
      }
    );
  }

  private sortAsc(a, b): number {
    const r1 = a.globalRating;
    const r2 = b.globalRating;

    if (r1 > r2) {
      return 1;
    } else if ( r1 < r2) {
      return -1;
    } else {
      return 0;
    }
  }

  private sortDec(a, b): number {
    const r1 = a.globalRating;
    const r2 = b.globalRating;

    if (r1 > r2) {
      return -1;
    } else if ( r1 < r2) {
      return 1;
    } else {
      return 0;
    }
  }

  private async setupGlobalRatingInfo(callback) {
    this.gamesService.getAllGlobalRatingInfo().subscribe(
       ratingInfo => {
        const map = new Map();
        for (let i = 0; i < ratingInfo.length; i++) {
          map.set(ratingInfo[i].game_id, ratingInfo[i]);
        }
        for (let i = 0; i < this.searchedGames.length; i++) {

          const key = this.searchedGames[i].id.toString();

          if (map.has(key)) {
            const ratingInfo = map.get(key);
            this.searchedGames[i].number_of_players = ratingInfo.number_of_players;
            this.searchedGames[i].number_of_ratings = ratingInfo.number_of_ratings;
            this.searchedGames[i].total_rating_value = ratingInfo.total_rating_value;
            if (ratingInfo.number_of_ratings == 0) {
              this.searchedGames[i].globalRating = 0;
            } else {
              this.searchedGames[i].globalRating = ratingInfo.total_rating_value / ratingInfo.number_of_ratings;
            }

          } else {
            this.searchedGames[i].number_of_players = 0;
            this.searchedGames[i].number_of_ratings = 0;
            this.searchedGames[i].total_rating_value = 0;
            this.searchedGames[i].globalRating = 0;
          }
        }
        callback();
      }
    );
  }

  private setupUserRatingInfo() {
    this.userService.fetchUser(localStorage.getItem('user')).subscribe(
      user => {
        const map = new Map();
        for (let i = 0; i < user.games_rated.length; i++) {
          map.set(user.games_rated[i].game_id, user.games_rated[i].rating);
        }
        for (let i = 0; i < this.searchedGames.length; i++) {

          const key = this.searchedGames[i].id.toString();

          if (map.has(key)) {
            this.searchedGames[i].userRating = map.get(key);
          } else {
            this.searchedGames[i].userRating = 0;
          }
        }
      }
    );
  }

  private setSortingOptions() {
    this.sortingOptions = [
      { label: 'None', value: NO_SORT },
      { label: 'Highest Shelf star rating', value: STAR_SORT_DESC },
      { label: 'Lowest Shelf star rating', value: STAR_SORT_ASC }
    ];
  }

}
