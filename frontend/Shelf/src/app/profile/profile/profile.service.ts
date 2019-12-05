import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
// tslint:disable-next-line: max-line-length
import {
  USER_DATA_URL,
  ALL_USERS_URL,
  FOLLOW_URL,
  UNFOLLOW_URL, SOME_USERS_URL
} from '../../constants/constants.urls';
import {ProfileModel} from '../../models/profile.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class ProfileService {

    constructor(private http: HttpClient, private router: Router) { }

    getUserData(username: string) {
        return this.http.post<ProfileModel>(USER_DATA_URL, {username} ).toPromise();
    }

    getAllUsers() {
        return this.http.get(ALL_USERS_URL).toPromise();
    }

  getUsersContaining(query: string) {
    return this.http.get(SOME_USERS_URL + query).toPromise();
  }

    followUser(username: string) {
        return this.http.post(FOLLOW_URL, { user: username }).toPromise();
    }

    unfollowUser(username: string) {
        return this.http.post(UNFOLLOW_URL, { user: username }).toPromise();
    }

}
