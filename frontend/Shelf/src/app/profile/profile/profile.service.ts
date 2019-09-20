import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
// tslint:disable-next-line: max-line-length
import { USER_DATA_URL, ALL_USERS_URL, ADD_FRIEND_URL, SEND_MESSAGE_URL, NEW_MESSAGE_URL, GET_ALL_MESSAGES_URL } from '../../constants/constants.urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class ProfileService {

    constructor(private http: HttpClient, private router: Router) { }

    getUserData(username: string) {
        return this.http.post<UserModel>(USER_DATA_URL, {username} ).toPromise();
    }

    getAllUsers() {
        return this.http.get(ALL_USERS_URL).toPromise();
    }

    addFriend(username: string) {
        return this.http.post(ADD_FRIEND_URL, { friend: username }).toPromise();
    }

    getMessages(receiver: string) {
        const info = {
            headers: new HttpHeaders({
                receiver
            })
        };
        return this.http.get(GET_ALL_MESSAGES_URL, info).toPromise().catch( err => {
            // window.location.reload();
        });
    }

}
