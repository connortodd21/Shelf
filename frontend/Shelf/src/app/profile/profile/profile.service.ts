import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
// tslint:disable-next-line: max-line-length
import {
  USER_DATA_URL,
  ALL_USERS_URL,
  SEND_MESSAGE_URL,
  NEW_MESSAGE_URL,
  GET_ALL_MESSAGES_URL,
  FOLLOW_URL,
  UNFOLLOW_URL
} from '../../constants/constants.urls';
import {ProfileModel} from "../../models/profile.model";

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

    followUser(username: string) {
        return this.http.post(FOLLOW_URL, { user: username }).toPromise();
    }

    unfollowUser(username: string) {
        return this.http.post(UNFOLLOW_URL, { user: username }).toPromise();
    }

    getMessages(receiver: string) {
        const info = {
            headers: new HttpHeaders({
                receiver
            })
        };
        return this.http.get(GET_ALL_MESSAGES_URL, info).toPromise();
    }

    sendMessage(message: string, messageID: string) {
        const options = {
            message,
            messageID
        };
        return this.http.post(SEND_MESSAGE_URL, options).toPromise();
    }

    newConversation(firstUser: string, secondUser: string) {
        const options = {
            firstUser,
            secondUser
        };
        return this.http.post(NEW_MESSAGE_URL, options).toPromise().catch(err => {});
    }

}
