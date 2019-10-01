import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { CHANGE_PASSWORD_URL, CHANGE_EMAIL_URL } from '../../constants/constants.urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class SettingsService {

    constructor(private http: HttpClient, private router: Router) { }

    changeEmail(email: string) {
        return this.http.post(CHANGE_EMAIL_URL, {email}).toPromise();
    }

    changePassword(password: string) {
        return this.http.post(CHANGE_PASSWORD_URL, {password}).toPromise();
    }
}
