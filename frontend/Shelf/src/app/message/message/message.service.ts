import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import {
  SEND_MESSAGE_URL,
  NEW_MESSAGE_URL,
  GET_ALL_MESSAGES_URL,
} from '../../constants/constants.urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class MessageService {

    constructor(private http: HttpClient, private router: Router) { }

    getMessages() {
        return this.http.get(GET_ALL_MESSAGES_URL).toPromise();
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
