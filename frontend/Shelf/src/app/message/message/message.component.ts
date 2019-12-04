import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { SEND_MESSAGE_NOTIFICATION } from '../../constants/constants.messages';
import { InboxService } from 'src/app/inbox/inbox/inbox.service';
import { Router } from '@angular/router';
import { MessageService } from './message.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  messages: Message[];
  currentMessages: Message;
  receiver: string;
  messageID: string;

  // tslint:disable-next-line: max-line-length
  constructor(private inboxService: InboxService, private router: Router, private messageService: MessageService) {
    this.messages = [];
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMessages().then((msg: any) => {
      let i = 0;
      msg.forEach(element => {
        this.messages[i++] = new Message(element);
      });
    });
  }

  sendMessage(message: string, messageID: string, receiver: string) {
    console.log(message + ' MessageID ' + messageID + ' Receiver: ' + receiver);
    this.messageService.sendMessage(message, messageID).then(res => {
      const sender = localStorage.getItem('user');
      this.inboxService.sendNotification(SEND_MESSAGE_NOTIFICATION(sender, receiver), receiver).then((resp) => {
        // window.location.reload();
      });
    });
  }

  updateCurrentMessages(receiver, messages, id) {
    this.currentMessages = messages;
    if (this.receiver === receiver) {
      this.receiver = '';
      return;
    }
    this.receiver = receiver;
    this.messageID = id;
  }
  goToProfile = (username: string) => {
    window.location.replace(`/profile/${username}`);
  }

}
