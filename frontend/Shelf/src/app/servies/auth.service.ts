import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth.data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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

    async login(username: string, password: string) {
        const userInfo: AuthData = {username, password, email: '', birthday: ''};
        await this.http.post<object>('http://localhost:8080/user/login', userInfo, httpOptions).pipe(
            map( response => {
                const token = response.headers.get('token');
                this.token = token;
                if (token) {
                    const expiresInDuration = 7200;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.responseLogin = 'complete';
                    localStorage.setItem('token', token);
                    localStorage.setItem('expiresIn', expirationDate.toISOString());
                    window.location.replace('/home');
                }
            })
        ).toPromise().catch( err => {
            if (err.error.message === 'Bad request: Login user data is incomplete') {
                this.responseLogin = 'badRequest';
            } else if (err.error.message === 'Unauthorized: Password is incorrect') {
               this.responseLogin = 'badPassword';
               return 'badPassword';
            } else if (err.error.message === 'Not Found: User does not exist') {
                this.responseLogin = 'DNE';
                return 'DNE';
            } else {
                this.responseLogin = 'failed';
                return 'FAILED';
            }
        });
        return this.responseLogin;
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

    private getAuthenticationData() {
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

    getAuthToken() {
        if (localStorage.getItem(this.token)) {
            return localStorage.getItem(this.token);
        }
        return false;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }
}
