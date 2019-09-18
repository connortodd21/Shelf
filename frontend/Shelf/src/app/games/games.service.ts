import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from "rxjs";
import { HttpHeaders } from '@angular/common/http';

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
}
