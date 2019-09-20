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
        this.user = {birthday: response.birthday, email: response.email, username: response.username, friends: response.friends, wishList: response.wish_list, dateCreated: response.date_created, inbox: response.inbox, gamesPlayed: response.games_played, gamesRated: response.games_rated, inboxID: response.inboxID};
      },
      (error) => console.log(error)
    );
  }

  private getDashboardGames() {

    this.gamesService.getDashboardGames().subscribe(
      // TODO try to make this nicer/ more performant in the future
      (response) => {
        this.dashboardGames = response;
        let i;
        for (i = 0; i < response.length; i++) {
          this.addRatingInfo(i);
        }
      }
    );

  }

  private addRatingInfo(i) {
    this.gamesService.getRatingInfo(this.dashboardGames[i].id).subscribe(
      ratingInfo => {
        if (ratingInfo) {
          this.dashboardGames[i].number_of_players = ratingInfo.number_of_players;
          this.dashboardGames[i].number_of_ratings = ratingInfo.number_of_ratings;
          this.dashboardGames[i].total_rating_value = ratingInfo.total_rating_value;
          this.dashboardGames[i].globalRating = ratingInfo.total_rating_value / ratingInfo.number_of_ratings;
        } else {
          this.dashboardGames[i].number_of_players = 0;
          this.dashboardGames[i].number_of_ratings = 0;
          this.dashboardGames[i].total_rating_value = 0;
          this.dashboardGames[i].globalRating = 0;
        }
      });
  }


  public goToProfile() {
    this.router.navigate(['/profile/' + this.user.username]);
  }


}
