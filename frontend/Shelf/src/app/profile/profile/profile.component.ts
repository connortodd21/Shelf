import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
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
  queryString: string;
  ratedGames;
  show: boolean;
  isOwner = false;
  followButtonText: string;
  followStatus: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(private inboxService: InboxService, private route: ActivatedRoute, private profileService: ProfileService, private gamesService: GamesService, private router: Router) {
    this.messages = [];
    // this.getMessages();
  }

  ngOnInit() {
    const username = this.route.snapshot.params.username;

    this.isOwner = this.determineIfOwner(username);

    this.profileService.getUserData(username).then(res => {
      this.user = new ProfileModel(res);
      this.getMessages();
      this.followers = res.followers;
      this.following = res.following;
      console.log(this.user);
      if (this.user.gamesRated.length > 0) {
        this.gamesService.getOverviewInfoAboutGames(this.user.gamesRated).subscribe((gamesInfo) => {
          if (gamesInfo !== null || gamesInfo !== undefined) {
            this.ratedGames = gamesInfo;
            this.addUserRating();
            this.addGlobalRating();
          }
          this.printUsefulInfo();
        });
      }



      console.log("prof service")
      this.profileService.getAllUsers().then(users => {
        let i: number;
        const response = [];

        response.push(users);

        this.allUsers = new Array(response[0].length);

        for (i = 0; i < response[0].length; i++) {
          const user = new ProfileModel(response[0][i]);

          this.setFollowStatus(user);

          this.allUsers[i] = user;
        }
      });
    });
  }

  public goToProfile(username) {
    window.location.replace('/profile/' + username);
  }

  public followUser(user) {
    const confirm = window.confirm('Are you sure you want to follow ' + user.username);
    if (confirm === false) {
      return;
    }

    this.followStatus = !this.followStatus;
    this.followButtonText = "Unfollow";
    const receiver = user.username;
    const sender = localStorage.getItem('user');

    this.followers.push(sender);

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

  public sendMessage(message: string) {
    this.profileService.sendMessage(message, this.messageID).then(res => {
      const sender = localStorage.getItem('user');
      const receiver = this.route.snapshot.params.username;
      this.inboxService.sendNotification(SEND_MESSAGE_NOTIFICATION(sender, receiver), receiver).then((resp) => {
        window.location.reload();
      });
    });
  }

  public newConversation() {
    this.profileService.newConversation(localStorage.getItem('user'), this.user.username);
  }

  private addUserRating() {
    const map = new Map();
    // tslint:disable: prefer-for-of
    for (let i = 0; i < this.user.gamesRated.length; i++) {
      map.set(this.user.gamesRated[i].game_id, this.user.gamesRated[i].rating);
    }

    for (let i = 0; i < this.ratedGames.length; i++) {
      if (map.has(this.ratedGames[i].id.toString())) {
        this.ratedGames[i].userRating = map.get(this.ratedGames[i].id.toString());
      }
    }
  }

  private addGlobalRating() {
    this.gamesService.getAllGlobalRatingInfo().subscribe(
      ratingInfo => {

        const map = new Map();
        for (let i = 0; i < ratingInfo.length; i++) {
          map.set(ratingInfo[i].game_id, ratingInfo[i]);
        }


        for (let i = 0; i < this.ratedGames.length; i++) {

          const key = this.ratedGames[i].id.toString();

          if (map.has(key)) {
            // tslint:disable: no-shadowed-variable
            const ratingInfo = map.get(key);
            this.ratedGames[i].number_of_players = ratingInfo.number_of_players;
            this.ratedGames[i].number_of_ratings = ratingInfo.number_of_ratings;
            this.ratedGames[i].total_rating_value = ratingInfo.total_rating_value;
            if (ratingInfo.number_of_ratings === 0) {
              this.ratedGames[i].globalRating = 0;
            } else {
              this.ratedGames[i].globalRating = ratingInfo.total_rating_value / ratingInfo.number_of_ratings;
            }

          } else {
            this.ratedGames[i].number_of_players = 0;
            this.ratedGames[i].number_of_ratings = 0;
            this.ratedGames[i].total_rating_value = 0;
            this.ratedGames[i].globalRating = 0;
          }
        }
      }
    );
  }

  private printUsefulInfo() {
    console.log('User');
    console.log(this.user);
  }

  toggleFollow() {
    console.log("begin");
    console.log(this.followStatus);

    if (this.followStatus == true) {
      this.unfollowUser(this.user);
    }
    else {
      this.followUser(this.user);
    }

    console.log("end")
    console.log(this.followStatus)

  }

  private determineIfOwner(username: string): boolean {
    const realUser = localStorage.getItem('user');
    if (username === realUser) {
      console.log("setting true");
      return true;
    }
    else {
      return false;
    }
  }

  public unfollowUser(user) {
    const confirm = window.confirm('Are you sure you want to unfollow ' + user.username );
    if (confirm === false) {
      return;
    }

    let realUser = localStorage.getItem('user');

    this.followers.splice(this.followers.indexOf(realUser),1);

    this.followStatus = !this.followStatus;
    this.followButtonText = "Follow";
    this.profileService.unfollowUser(user.username);
  }

  private setFollowStatus(user: ProfileModel) {
    if (user.username === localStorage.getItem('user')) {
      //check to see if this person is in the followers section
      console.log("checking follow status");
      this.followButtonText = "Follow";
      this.followStatus = false;
      for (let i = 0; i < user.following.length; i++) {
        if (user.following[i] === this.user.username) {
          this.followButtonText = "Unfollow";
          this.followStatus = true;
          break;
        }
      }
    }

  }
}
