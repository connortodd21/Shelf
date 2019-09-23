import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from '../../models/user.model';
import {UserService} from '../../user/user.service';
import {GamesService} from '../../games/games.service';

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
        this.user = {birthday: response.birthday, email: response.email, username: response.username, wishList: response.wish_list, dateCreated: response.date_created, inbox: response.inbox, gamesPlayed: response.games_played, gamesRated: response.games_rated, inboxID: response.inboxID, followers: response.followers, following: response.following};
      },
      (error) => console.log(error)
    );
  }

  private getDashboardGames() {

    this.gamesService.getDashboardGames().subscribe(
      (response) => {

        this.dashboardGames = response;

        this.setupGlobalRatingInfo();
        this.setupUserRatingInfo();

      }
    );
  }

  public goToProfile() {
    this.router.navigate(['/profile/' + this.user.username]);
  }


  private setupGlobalRatingInfo() {
    this.gamesService.getAllGlobalRatingInfo().subscribe(
      ratingInfo => {

        let map = new Map();
        for (let i = 0; i < ratingInfo.length; i++) {
          map.set(ratingInfo[i].game_id, ratingInfo[i]);
        }


        for (let i = 0; i < this.dashboardGames.length; i++) {

          let key = this.dashboardGames[i].id.toString();

          if (map.has(key)) {
            let ratingInfo = map.get(key);
            this.dashboardGames[i].number_of_players = ratingInfo.number_of_players;
            this.dashboardGames[i].number_of_ratings = ratingInfo.number_of_ratings;
            this.dashboardGames[i].total_rating_value = ratingInfo.total_rating_value;
            if (ratingInfo.number_of_ratings == 0) {
              this.dashboardGames[i].globalRating = 0;
            }
            else {
              this.dashboardGames[i].globalRating = ratingInfo.total_rating_value / ratingInfo.number_of_ratings;
            }

          }
          else {
            this.dashboardGames[i].number_of_players = 0;
            this.dashboardGames[i].number_of_ratings = 0;
            this.dashboardGames[i].total_rating_value = 0;
            this.dashboardGames[i].globalRating = 0;
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
        for (let i = 0; i < this.dashboardGames.length; i++) {

          let key = this.dashboardGames[i].id.toString();

          if (map.has(key)) {
            this.dashboardGames[i].userRating = map.get(key);
          }
          else {
            this.dashboardGames[i].userRating = 0;
          }
        }

        console.log(this.dashboardGames)
      }
    )
  }
}
