import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {GameModel} from './game.model';
import {RatingModel} from '../models/rating.model';
import {ADD_COMMENT_URL, DELETE_COMMENT_URL, UPVOTE_URL, DOWNVOTE_URL, ADD_WISH_LIST_URL} from '../constants/constants.urls';

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
    // tslint:disable-next-line: curly
    if (games.length === 0) return null;
    const gameIds = games.map(a => a.game_id);
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
    const username = localStorage.getItem('user');
    return this.http.get<GameModel>('http://localhost:8080/user/' + username + '/games-rated');
  }

  submitRatingToUser(newRating: number, oldRating: number, gameId: string): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.post<object>('http://localhost:8080/user/' + username + '/games-rated', {
      gameId,
      newRating,
      oldRating,
    });
  }

  submitRatingToGame(newRating: string, oldRating: number, gameId: string, gameName: string): Observable<any> {
    return this.http.post<object>('http://localhost:8080/ratingInfo/' + gameId, {
      gameId,
      newRating,
      oldRating,
      gameName
    });
  }

  fetchUserRating(id: string) {
    const username = localStorage.getItem('user');
    return this.http.get<RatingModel>('http://localhost:8080/user/' + username  + '/games-rated/' + id);
  }

  addComment(comment: string, gameID: string) {
    const data = {
      comment,
      gameID
    };

    return this.http.post(ADD_COMMENT_URL, data).toPromise();
  }

  deleteComment(commentID: string, gameID: string) {
    const data = {
      commentID,
      gameID
    };

    return this.http.post(DELETE_COMMENT_URL, data).toPromise();
  }

  upvote(commentID: string, gameID: string) {
    const data = {
      commentID,
      gameID
    };

    return this.http.post(UPVOTE_URL, data).toPromise();
  }

  downvote(commentID: string, gameID: string) {
    const data = {
      commentID,
      gameID
    };

    return this.http.post(DOWNVOTE_URL, data).toPromise();
  }

  addToWishList(id) {
    const body = {
      id,
      username: localStorage.getItem('user')
    };

    return this.http.post(ADD_WISH_LIST_URL, body).toPromise();
  }
}
