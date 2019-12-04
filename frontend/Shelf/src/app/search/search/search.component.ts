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

  constructor(private router: Router, private gamesService: GamesService) {

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

  public getSearchedGames() {
    this.gamesService.getSearchedGames(this.queryString, localStorage.getItem("user")).subscribe(
      (response) => {
        this.searchedGames = response;
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
