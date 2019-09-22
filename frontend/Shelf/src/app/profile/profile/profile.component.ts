import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserModel } from '../../models/user.model';
import { ProfileModel } from '../../models/profile.model';
import { Message } from '../../models/message.model';
import { InboxService } from '../../inbox/inbox/inbox.service';
import { SEND_MESSAGE_NOTIFICATION, NEW_FOLLOWER_NOTIFICATION } from '../../constants/constants.messages';
import { GamesService } from 'src/app/games/games.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: ProfileModel;
  allUsers: ProfileModel[];
  followers: string[];
  following: string[];
  messages: Message[];
  messageID: string;
  ratedGames;
  globalRating: number;
  userRating: number;

  // tslint:disable-next-line: max-line-length
  constructor(private inboxService: InboxService, private route: ActivatedRoute, private profileService: ProfileService, private gamesService: GamesService, private router: Router) {
    this.messages = [];
  }

  ngOnInit() {
    const username = this.route.snapshot.params.username;
    this.profileService.getUserData(username).then(res => {
      this.user = new ProfileModel(res);
      console.log(this.user);
      this.followers = res.followers;
      this.following = res.following;
      this.gamesService.getOverviewInfoAboutGames(this.user.gamesRated).subscribe((gamesInfo) => {
        if (gamesInfo != null || gamesInfo != undefined)
          this.ratedGames = gamesInfo;
      });
      this.profileService.getAllUsers().then(users => {
        let i: number;
        const response = [];

        response.push(users);

        this.allUsers = new Array(response[0].length);

        for (i = 0; i < response[0].length; i++) {
          const user = new ProfileModel(response[0][i]);
          this.allUsers[i] = user;
        }
      });
    });


  }

  public goToProfile(username) {
    window.location.replace('/profile/' + username);
  }

  public followUser(user) {
    const confirm = window.confirm('Are you sure you want to follow ' + user.username );
    if (confirm === false) {
      return;
    }
    const receiver = user.username;
    const sender = localStorage.getItem('user');
    this.profileService.followUser(receiver).then(() => {
      this.inboxService.sendNotification(NEW_FOLLOWER_NOTIFICATION(sender, receiver), receiver).then((resp) => {
        window.location.reload();
      });
    });
  }

  public isMyProfile() {
    if (this.route.snapshot.params.username === localStorage.getItem('user')) {
      return true;
    }
    return false;
  }

  public getMessages() {
    this.profileService.getMessages(this.route.snapshot.params.username).then(msg => {
      if (msg) {
        // tslint:disable: no-string-literal
        const messages = msg['messages'];
        this.messageID = msg['_id'];
        let i = 0;
        messages.forEach(message => {
          this.messages[i] = new Message(message);
          i++;
        });
      } else {
        this.newConversation();
      }
    });
  }

  public sendMessage(message: string, receiver: string) {
    this.profileService.sendMessage(message, this.messageID).then(res => {
      const sender = localStorage.getItem('user');
      receiver = this.route.snapshot.params.username;
      this.inboxService.sendNotification(SEND_MESSAGE_NOTIFICATION(sender, receiver), receiver).then((resp) => {
        window.location.reload();
      });
    });
  }

  public newConversation() {
    this.profileService.newConversation(localStorage.getItem('user'), this.user.username);
  }

}
