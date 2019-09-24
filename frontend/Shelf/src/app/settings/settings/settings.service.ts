import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { FORGOT_PASSWORD_URL, CHANGE_PASSWORD_URL, VERIFY_EMAIL_URL } from '../../constants/constants.urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class SettingsService {

    constructor(private http: HttpClient, private router: Router) { }


    verifyEmail() {

    }

    changePassword() {

    }
}
