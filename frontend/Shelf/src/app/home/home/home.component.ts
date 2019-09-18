import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../user/user.service';
import { GamesService } from '../../games/games.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserModel;
  dashboardGames;

  constructor(private router: Router, private userService: UserService, private gamesService: GamesService) { }
    ngOnInit() {
    this.setupUser();
    this.getDashboardGames();
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
        this.user = {birthday: response.birthday, email: response.email, username: response.username, friends: response.friends, wishList: response.wish_list, dateCreated: response.date_created, inbox: response.inbox, gamesPlayed: response.games_played, gamesRated: response.games_rated};
      },
      (error) => console.log(error)
    );
  }

  private getDashboardGames() {
    this.gamesService.getDashboardGames().subscribe(
      (response) => {
        this.dashboardGames = response;
        console.log(this.dashboardGames);
      }
    );
  }

  public goToProfile() {
    window.location.replace('/profile/' + this.user.username);
  }
}


