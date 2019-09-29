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

  getDashboardGames(): Observable<any> {
    return this.http.get('http://localhost:8080/games/criticallyacclaimedgames');
  }

  getSearchedGames(search, sortingOption): Observable<any> {
    return this.http.post<object>('http://localhost:8080/games/searchedgames', {
      search,
      sortingOption
    });
  }

  // BEN TODO: MAKE THESE URLS CONSTANTS
  getDetailedInfoAboutGame(id): Observable<any> {
    return this.http.post<object>('http://localhost:8080/games/detailedgamedata', {
      id
    });
  }

  getOverviewInfoAboutGames(games): Observable<any> {
    if (games.length == 0) return null;
    let gameIds = games.map(a => a.game_id);
    return this.http.post<object>('http://localhost:8080/games/multiplegameoverviews', {
      gameIds
    });
  }

  getGlobalRatingInfo(id: string): Observable<any> {
    return this.http.get<GameModel>(`http://localhost:8080/ratingInfo/${id}`);
  }

  getAllGlobalRatingInfo(): Observable<any> {
    return this.http.get<GameModel>('http://localhost:8080/ratingInfo/all');
  }

  getAllUserRatingInfo(): Observable<any> {
    let username = localStorage.getItem('user');
    return this.http.get<GameModel>('http://localhost:8080/user/' + username + '/games-rated');
  }

  submitRatingToUser(newRating: number, oldRating: number, gameId: string): Observable<any> {
    let username = localStorage.getItem('user');
    return this.http.post<object>('http://localhost:8080/user/' + username + "/games-rated", {
      gameId,
      newRating,
      oldRating
    });
  }

  submitRatingToGame(newRating: string, oldRating: number, gameId: string): Observable<any> {
    console.log("submitting rating to game");
    console.log(newRating);
    console.log("oldRating");

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
