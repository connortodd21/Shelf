import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ADD_NOTIFICATION_URL, DELETE_NOTIFICATION_URL, GET_INBOX_URL, MARK_AS_READ_URL } from '../../constants/constants.urls';
import { Inbox } from '../../models/inbox.model';

@Injectable({ providedIn: 'root' })

export class InboxService {

  constructor(private http: HttpClient, private router: Router) { }

  sendNotification(message: string, receiver: string) {
    const options = {
        message,
        receiver
    };
    return this.http.post(ADD_NOTIFICATION_URL, options).toPromise();
  }

  deleteNotification(notificationID: string) {
    return this.http.post(DELETE_NOTIFICATION_URL, {notificationID} ).toPromise();
  }

  getInbox() {
    return this.http.get(GET_INBOX_URL).toPromise();
  }

  markAsRead(notificationID: string) {
    return this.http.post(MARK_AS_READ_URL, {notificationID} ).toPromise();
  }

}
