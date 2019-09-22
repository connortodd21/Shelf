import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {HOME_PAGE} from '../constants/constants.pages';
import {GameModel} from './game.model';
import {RatingModel} from "../models/rating.model";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient, private router: Router) { }

  // BEN TODO: MAKE THESE URLS CONSTANTS
  getDashboardGames(): Observable<any> {
    return this.http.get('http://localhost:8080/games/allgames');
  }

  // BEN TODO: MAKE THESE URLS CONSTANTS
  getDetailedInfoAboutGame(id): Observable<any> {
    return this.http.post<object>('http://localhost:8080/games/detailedgamedata', {
      id
    });
  }

  getOverviewInfoAboutGames(games): Observable<any> {
    let gameIds = games.map(a => a.game_id);
    console.log('In the game service!');
    return this.http.post<object>('http://localhost:8080/games/multiplegameoverviews', {
      gameIds
    });
  }


  getRatingInfo(id: string): Observable<any> {
    return this.http.get<GameModel>('http://localhost:8080/ratingInfo/' + id);

  }

  toHomePage() {
    this.router.navigate([HOME_PAGE]);
  }

  submitRatingToUser(newRating: number, oldRating: number, gameId: string): Observable<any> {
    console.log('CALLING SUBMIT');

    //update games_rated

    console.log(newRating);
    console.log(oldRating);
    let username = localStorage.getItem('user');
    return this.http.post<object>('http://localhost:8080/user/' + username + "/games-rated", {
      gameId,
      newRating,
      oldRating
    });
  }

  submitRatingToGame(newRating: string, oldRating: number, gameId: string): Observable<any> {

    return this.http.post<object>('http://localhost:8080/ratingInfo/' + gameId, {
      gameId,
      newRating,
      oldRating
    });
  }

  fetchUserRating(id: string) {
    let username = localStorage.getItem('user');
    return this.http.get<RatingModel>('http://localhost:8080/user/' + username  + "/games-rated/" + id);
  }
}
