import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth.data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class LoginService {

    constructor(private http: HttpClient, private router: Router) { }

    registerUser(authData: AuthData): Observable<any> {
        return this.http.post<object>('http://localhost:8080/user/register', authData);
    }
}
