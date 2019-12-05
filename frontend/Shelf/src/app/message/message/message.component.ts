import {Component, OnInit} from '@angular/core';
import {Message} from 'src/app/models/message.model';
import {SEND_MESSAGE_NOTIFICATION} from '../../constants/constants.messages';
import {InboxService} from 'src/app/inbox/inbox/inbox.service';
import {Router} from '@angular/router';
import {MessageService} from './message.service';
import {ProfileService} from "../../profile/profile/profile.service";


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
  showDetails: boolean;
  users;
  filterText: string;

  // tslint:disable-next-line: max-line-length
  constructor(private inboxService: InboxService, private router: Router, private messageService: MessageService, private profileService: ProfileService) {
    this.messages = [];
    this.showDetails = false;
  }

  switchDetails() {
    this.showDetails = !this.showDetails;
    this.receiver = null;
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

    this.messageService.sendMessage(message, messageID).then(res => {
      const sender = localStorage.getItem('user');
      this.inboxService.sendNotification(SEND_MESSAGE_NOTIFICATION(sender, receiver), receiver).then((resp) => {
        this.refreshMessages()
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
    this.showDetails = false;
  }
  goToProfile = (username: string) => {
    window.location.replace(`/profile/${username}`);
  }

  handleClick($event: MouseEvent) {
   this.refreshMessages()
  }

  refreshMessages() {
    this.messages = [];
    this.messageService.getMessages().then((msg: any) => {
      let i = 0;
      msg.forEach(element => {
        this.messages[i++] = new Message(element);
      });

      this.currentMessages = null;

      for (let i = 0; i < this.messages.length; i++) {
        if (this.receiver === this.messages[i].receiver) {
          // @ts-ignore
          this.currentMessages = this.messages[i].messages
          break;
        }
      }
    });
  }

  newMessage(username: string) {
    const me = localStorage.getItem('user');
    this.messageService.newConversation(username, me).then(res => {
      this.getMessages();
      let temp: any = res;
      this.messageID = temp._id
      this.showDetails = false;
      this.receiver = username;
      this.refreshMessages()
    });


  }

  updateUserList() {
    console.log("updating user list")
    if (!this.filterText || this.filterText.length < 1) {
      this.users = [];
    }
    else {
      this.profileService.getUsersContaining(this.filterText).then(users => {
        // console.log(users)
        this.users = users;
      });
    }
  }
}
