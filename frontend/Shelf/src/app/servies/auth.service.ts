import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth.data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class AuthService {

    private tokenTimer: any;
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    responseLogin = 'NULL';

    constructor(private http: HttpClient, private router: Router) { }

    registerUser(email: string, username: string, password: string, birthday: string) {
        const auth: AuthData = { email, username, password, birthday };
        return this.http.post<object>('http://localhost:8080/user/register', auth).toPromise();
    }

    logoutUser() {
        const user = localStorage.getItem('user');
        return this.http.post<object>('http://localhost:8080/user/logout', user).toPromise();
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }

    checkAuthenticationStatus() {
        const authInfo = this.getAuthenticationData();
        if (!authInfo) {
            return;
        }

        const currentTime: Date = new Date();
        const expiresIn = new Date(authInfo.expirationDate).getTime() - currentTime.getTime();
        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    getAuthenticationData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return { token, expirationDate };
    }

    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
}
