import { Component, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { GamesService } from '../../games/games.service';
import { SelectItem} from 'primeng/api';
import { NO_SORT, STAR_SORT_ASC, STAR_SORT_DESC } from './search.constants';
import { number } from 'ngx-custom-validators/src/app/number/validator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchedGames;
  tempGames;
  filteredGames;
  queryString = '';
  sortingOptions: SelectItem[];
  platformOptions: SelectItem[];
  genreOptions;
  selectedSortingOption = NO_SORT;
  selectedPlatformOption = 0;
  selectedGenreOption = 0;

  constructor(private router: Router, private gamesService: GamesService) {

  }

  ngOnInit() {
    this.setSortingOptions();
    this.setGenreOptions();
    this.setPlatformOptions();

    this.router.events.subscribe((evt) => {
        if (evt instanceof ResolveEnd && evt.url.split('/')[1] === 'search') {
          this.queryString = evt.url.split('/')[2];
          this.getSearchedGames();
        }
      });

  }

  public getSearchedGames() {
    let genreSearchID = 0;
    for (const item of this.genreOptions) {
      if (this.queryString.toLowerCase().search(item.name.toLowerCase()) !== -1) {
        genreSearchID = item.id;
      }
    }
    this.gamesService.getSearchedGames(this.queryString, genreSearchID, localStorage.getItem('user')).subscribe(
      (response) => {
        this.searchedGames = response;
        this.tempGames = response;
        this.sortPlatforms();
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

  private setPlatformOptions() {
    this.platformOptions = [
      { label: 'All Platforms', value: 0 }
    ];
    this.gamesService.getGamePlatforms().subscribe(
      (response) => {
        for (const platform of response) {
          this.platformOptions.push({ label: platform.name, value: platform.id });
        }
      }
    );
  }

  private sortPlatforms() {
    if (this.selectedPlatformOption !== 0 && this.tempGames) {
      this.searchedGames = [];
      for (const item of this.tempGames) {
        if (item.platforms !== undefined) {
          for (const platform of item.platforms) {
            if (platform === this.selectedPlatformOption) {
              this.searchedGames.push(item);
            }
          }
        }
      }
    } else {
      this.searchedGames = this.tempGames;
    }
  }

  private setGenreOptions() {
    this.gamesService.getGameGenres().subscribe(
      (response) => {
        this.genreOptions = response;
      }
    );
  }

}
