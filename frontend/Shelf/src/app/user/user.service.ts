import {  Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LOGOUT_URL, USER_DATA_URL } from '../constants/constants.urls';
import { UserModel } from '../models/user.model';



@Injectable({ providedIn: 'root' })

export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  fetchUser(username): Observable<any> {
    return this.http.post<UserModel>(USER_DATA_URL, {username} );
  }

  logoutUser(): boolean {
    const user = localStorage.getItem('user');
    this.http.post<object>(LOGOUT_URL, { username: user }).subscribe(
      () => {
        this.logout();
        return true;
        },
      () => {
        return false;
      }
    );
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);

  }

}
