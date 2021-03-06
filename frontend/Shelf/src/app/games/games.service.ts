import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {GameModel} from './game.model';
import {RatingModel} from '../models/rating.model';
import {ADD_COMMENT_URL, DELETE_COMMENT_URL, UPVOTE_URL, DOWNVOTE_URL, ADD_IMAGE_URL, ADD_WISH_LIST_URL, REMOVE_WISH_LIST_URL} from '../constants/constants.urls';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient, private router: Router) { }

  getDashboardGames(username: String): Observable<any> {
    return this.http.get(`http://localhost:8080/games/criticallyacclaimedgames/${username}`);
  }

  getUpcomingGameDates(username: string): Observable<any> {
    return this.http.get(`http://localhost:8080/games/upcominggamedates/${username}`);
  }

  getUpcomingGames(gameID, username: string): Observable<any> {
    return this.http.post<object>(`http://localhost:8080/games/upcominggames/${username}`, {
      gameID,
    });
  }

  getSearchedGames(search, genreID, username: String): Observable<any> {
    return this.http.post<object>(`http://localhost:8080/games/searchedgames/${username}`, {
      search,
      genreID,
    });
  }

  getGamePlatforms(): Observable<any> {
    return this.http.get<object>(`http://localhost:8080/games/gameplatforms`);
  }

  getGameGenres(): Observable<any> {
    return this.http.get<object>(`http://localhost:8080/games/gamegenres`);
  }

  // BEN TODO: MAKE THESE URLS CONSTANTS
  getDetailedInfoAboutGame(id): Observable<any> {
    return this.http.post<object>('http://localhost:8080/games/detailedgamedata', {
      id
    });
  }

  getOverviewInfoAboutGames(games, username: String): Observable<any> {
    // tslint:disable-next-line: curly
    if (games.length === 0) return null;
    const gameIds = games.map(a => a.game_id);
    console.log(gameIds);
    return this.http.post<object>(`http://localhost:8080/games/multiplegameoverviews/${username}`, {
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

  submitRatingToUser(newRating: number, oldRating: number, gameId: string, coverUrl: string): Observable<any> {
    const username = localStorage.getItem('user');
    console.log(coverUrl)
    return this.http.post<object>('http://localhost:8080/user/' + username + '/games-rated', {
      gameId,
      newRating,
      oldRating,
      coverUrl
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

  addImage(formData, id) {
    const info = {
      headers: new HttpHeaders({
          'Content-Type': 'application/form-data',
          id
      })
    }
    console.log(formData.getAll('image'))
    return this.http.post(ADD_IMAGE_URL, formData).toPromise();
  }

  addToWishList(id, gameName) {
    const body = {
      id,
      gameName
    };

    return this.http.post(ADD_WISH_LIST_URL, body).toPromise();
  }

  removeFromWishList(id) {
    const body = {
      id,
      username: localStorage.getItem('user')
    };

    return this.http.post(REMOVE_WISH_LIST_URL, body).toPromise();
  }
}
