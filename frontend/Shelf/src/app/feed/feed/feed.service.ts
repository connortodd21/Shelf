import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GET_FEED_URL } from '../../constants/constants.urls';
import { Feed } from 'src/app/models/feed.model';

@Injectable({ providedIn: 'root' })

export class FeedService {

  constructor(private http: HttpClient, private router: Router) { }

  getFeed() {
      return this.http.get<any[]>(GET_FEED_URL).toPromise();
  }

}
