import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../user/user.service';
import { GamesService } from '../../games/games.service';
import { SelectItem } from 'primeng/api';
import {
  GLOBAL_RATING_ASC,
  GLOBAL_RATING_DESC,
  RANDOM_SORTING,
  USER_RATING_ASC,
  USER_RATING_DESC
} from './home.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserModel;
  dashboardGames;
  filterText: string;
  sortOptions: SelectItem[];
  selectedOption = RANDOM_SORTING;

  constructor(private router: Router, private userService: UserService, private gamesService: GamesService) { }
  ngOnInit() {
    this.setupUser();
    this.getDashboardGames();
    this.setSortOptions();
  }


  logout() {
    if (!this.userService.logoutUser()) {

    }
  }

  private setupUser() {
    this.userService.fetchUser(localStorage.getItem('user')).subscribe(
      (response) => {
        console.log(response);
        // tslint:disable: max-line-length
        this.user = { birthday: response.birthday, email: response.email, username: response.username, wishList: response.wish_list, dateCreated: response.date_created, inbox: response.inbox, gamesPlayed: response.games_played, gamesRated: response.games_rated, inboxID: response.inboxID, followers: response.followers, following: response.following };
      },
      (error) => console.log(error)
    );
  }

  private getDashboardGames() {

    this.gamesService.getDashboardGames(localStorage.getItem('user')).subscribe(
      (response) => {
        console.log(response);
        this.dashboardGames = response;

        if (response) {
          this.shuffle(response);
        }

      }
    );
  }

  public goToProfile() {
    this.router.navigate(['/profile/' + this.user.username]);
  }

  private setSortOptions() {
    this.sortOptions = [
      { label: 'Random', value: RANDOM_SORTING },
      { label: 'Global Rating: Asc', value: GLOBAL_RATING_ASC },
      { label: 'Global Rating: Desc', value: GLOBAL_RATING_DESC },
      { label: 'User Rating: Asc', value: USER_RATING_ASC },
      { label: 'User Rating: Desc', value: USER_RATING_DESC },
    ];
  }

  private shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
