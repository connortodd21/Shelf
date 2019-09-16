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

  getDashboardGames(): Observable<any> {
    return this.http.post('https://api-v3.igdb.com/games', 'fields id,name,genres,summary,tags,category,url,rating;', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'user-key': '627c80f0f5bb9d77ae1a092ed94de20b'
      })
    })
  }
}
