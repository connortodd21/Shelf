import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, Router } from '@angular/router';
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
  urlSearch;
  queryString = '';
  sortingOptions: SelectItem[];
  platformOptions: SelectItem[];
  genreOptions;
  selectedSortingOption = NO_SORT;
  selectedPlatformOption = 0;
  selectedGenreOption = 0;

  constructor(private route: ActivatedRoute, private router: Router, private gamesService: GamesService) {

  }

  ngOnInit() {
    this.setSortingOptions();
    this.setGenreOptions();
    this.setPlatformOptions();
    this.urlSearch = window.location.pathname;

    this.router.events.subscribe((evt) => {
        if (evt instanceof ResolveEnd && evt.url.split('/')[1] === 'search') {
          this.queryString = evt.url.split('/')[2];
          this.getSearchedGames();
        }
      });

    if (this.urlSearch.includes('/:')) {
      this.urlSearch = this.urlSearch.substring(9);
      this.queryString = decodeURIComponent(this.urlSearch);
      this.getSearchedGames();
    }

  }

  public getSearchedGames() {
    let genreSearchID = 0;
    for (const item of this.genreOptions) {
      if (item.name.toLowerCase().search(this.queryString.toLowerCase()) !== -1 ||
          item.name.toLowerCase().includes(this.queryString.toLowerCase())) {
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
    // this.gamesService.getGameGenres().subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.genreOptions = response;
    //   }
    // );
    this.genreOptions = [
      {
        "id": 31,
        "name": "Adventure"
      },
      {
        "id": 33,
        "name": "Arcade"
      },
      {
        "id": 4,
        "name": "Fighting"
      },
      {
        "id": 25,
        "name": "Hack and slash/Beat 'em up"
      },
      {
        "id": 32,
        "name": "Indie"
      },
      {
        "id": 7,
        "name": "Music"
      },
      {
        "id": 30,
        "name": "Pinball"
      },
      {
        "id": 8,
        "name": "Platform"
      },
      {
        "id": 2,
        "name": "Point-and-click"
      },
      {
        "id": 9,
        "name": "Puzzle"
      },
      {
        "id": 26,
        "name": "Quiz/Trivia"
      },
      {
        "id": 10,
        "name": "Racing"
      },
      {
        "id": 11,
        "name": "Real Time Strategy (RTS)"
      },
      {
        "id": 12,
        "name": "Role-playing (RPG)"
      },
      {
        "id": 5,
        "name": "Shooter"
      },
      {
        "id": 13,
        "name": "Simulator"
      },
      {
        "id": 14,
        "name": "Sport"
      },
      {
        "id": 15,
        "name": "Strategy"
      },
      {
        "id": 24,
        "name": "Tactical"
      },
      {
        "id": 16,
        "name": "Turn-based strategy (TBS)"
      },
      {
        "id": 34,
        "name": "Visual Novel"
      }
    ]
  }

}
