import { Component, OnInit } from '@angular/core';
import { Inbox } from '../../models/inbox.model';
import { InboxService } from './inbox.service';
import { Router } from '@angular/router';
import { MARK_AS_READ_URL } from 'src/app/constants/constants.urls';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  inbox: Inbox[];
  hasNotifications = false;
  component: string;
  componentUsername: string;

  constructor(private inboxService: InboxService, private router: Router) {
    this.inbox = [];
    this.component = 'inbox';
  }

  ngOnInit() {
    this.inboxService.getInbox().then(res => {
      // tslint:disable-next-line: no-string-literal
      const inbox = res['notification'];
      if (inbox) {
        this.hasNotifications = true;
        let i = 0;
        for (let j = inbox.length - 1; j >= 0; j--) {
          if (inbox[i].message.includes('message')) {
            this.inbox[i++] = new Inbox(inbox[j], 'message');
          } else {
            this.inbox[i++] = new Inbox(inbox[j], 'follower');
          }
        }
      }
    });
  }

  // This is what the 'X' calls to clear the notifications. I have no idea how to get the messageID for markAsRead()
  clearNotifications() {
    this.inboxService.clearNotifications().then(res => {
      this.inbox = []
      console.log(res)
    })
  }

  renderComponent(location: string) {
    if (location === 'messages') {
      const nav = '/messages';
      window.location.replace(nav);
    } else {
      const nav = '/profile/' + location;
      window.location.replace(nav);
    }
  }

}
