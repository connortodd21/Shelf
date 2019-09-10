import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth.data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    registerUser(email: string, username: string, password: string, birthday: string) {
        const auth: AuthData = { email: email, username: username, password: password, birthday: birthday };
        return this.http.post<Object>('http://localhost:8080/user/register', auth).toPromise();
    }
}
