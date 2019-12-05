import {Component, OnChanges, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { ProfileModel } from '../../models/profile.model';
import { InboxService } from '../../inbox/inbox/inbox.service';
import { NEW_FOLLOWER_NOTIFICATION } from '../../constants/constants.messages';
import { GamesService } from 'src/app/games/games.service';
import {SelectItem} from "primeng/api";
import {
  GLOBAL_RATING_ASC,
  GLOBAL_RATING_DESC,
  RANDOM_SORTING,
  USER_RATING_ASC,
  USER_RATING_DESC
} from "../../home/home/home.constants";

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
  queryString: string;
  ratedGames;
  wishList;
  show: boolean;
  isOwner = false;
  followButtonText: string;
  followStatus: boolean;
  sortOptions: SelectItem[];
  selectedOption = RANDOM_SORTING;

  // tslint:disable-next-line: max-line-length
  constructor(private inboxService: InboxService, private route: ActivatedRoute, private profileService: ProfileService, private gamesService: GamesService, private router: Router) {
    //Hi this is kind of bad bc it will force ngOnInit to be called every single time
    //but it was put in to fix the issue where you are on a profile page and click MyShelf
    //without this, it wouldn't load your prof page bc the component would already be init
    //normally I would do it a better way but 1 week left so
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    const username = this.route.snapshot.params.username;
    this.setSortOptions();
    this.isOwner = this.determineIfOwner(username);

    this.profileService.getUserData(username).then(res => {
      this.user = new ProfileModel(res);
      this.followers = res.followers;
      this.following = res.following;
      console.log(this.user);
      if (this.user.gamesRated.length > 0) {
        this.gamesService.getOverviewInfoAboutGames(this.user.gamesRated, this.user.username).subscribe((gamesInfo) => {
          if (gamesInfo !== null || gamesInfo !== undefined) {
            this.ratedGames = gamesInfo;
            //this.addUserRating();
            //this.addGlobalRating();
          }
          this.printUsefulInfo();
        });
      }

      if (this.user.wishList.length > 0) {
        const temp = [];
        for (let i = 0; i < this.user.wishList.length; i++) {
          temp.push({game_id: this.user.wishList[i]});
        }
        this.gamesService.getOverviewInfoAboutGames(temp, this.user.username).subscribe((gamesInfo) => {
          console.log("Wish listed games");
          console.log(gamesInfo);
          this.wishList = gamesInfo;
        });
      }



      console.log('prof service');
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


  public followUser(user) {
    const confirm = window.confirm('Are you sure you want to follow ' + user.username);
    if (confirm === false) {
      return;
    }

    this.followStatus = !this.followStatus;
    this.followButtonText = 'Unfollow';
    const receiver = user.username;
    const sender = localStorage.getItem('user');

    this.followers.push(sender);

    this.profileService.followUser(receiver).then(() => {
      this.inboxService.sendNotification(NEW_FOLLOWER_NOTIFICATION(sender, receiver), receiver);
    });
  }

  public isMyProfile() {
    if (this.route.snapshot.params.username === localStorage.getItem('user')) {
      return true;
    }
    return false;
  }

  private printUsefulInfo() {
    console.log('User');
    console.log(this.user);
  }

  toggleFollow() {
    console.log('begin');
    console.log(this.followStatus);

    if (this.followStatus === true) {
      this.unfollowUser(this.user);
    } else {
      this.followUser(this.user);
    }

    console.log('end');
    console.log(this.followStatus);

  }

  private determineIfOwner(username: string): boolean {
    const realUser = localStorage.getItem('user');
    if (username === realUser) {
      console.log('setting true');
      return true;
    } else {
      return false;
    }
  }

  public unfollowUser(user) {
    const confirm = window.confirm('Are you sure you want to unfollow ' + user.username );
    if (confirm === false) {
      return;
    }

    const realUser = localStorage.getItem('user');

    this.followers.splice(this.followers.indexOf(realUser), 1);

    this.followStatus = !this.followStatus;
    this.followButtonText = 'Follow';
    this.profileService.unfollowUser(user.username);
  }

  public isTopUser() {
    const tempUsers = this.allUsers;
    tempUsers.sort((first, second) => {
      return ((first.followers.length * 2 + first.gamesRated.length) < (second.followers.length * 2 + second.gamesRated.length)) ? 1 : -1;
    });
    for (let i = 0; i < 10; i++) {
      if (tempUsers[i].username === this.user.username) {
        return true;
      }
    }
    return false;
  }

  private setSortOptions() {
    this.sortOptions = [
      { label: 'Random', value: RANDOM_SORTING },
      { label: 'Global Rating: Asc', value: GLOBAL_RATING_ASC },
      { label: 'Global Rating: Desc', value: GLOBAL_RATING_DESC },
      { label: 'User Rating: Asc', value: USER_RATING_ASC },
      { label: 'User Rating: Desc', value: USER_RATING_DESC },
    ];
  }

  private setFollowStatus(user: ProfileModel) {
    if (user.username === localStorage.getItem('user')) {
      // check to see if this person is in the followers section
      console.log('checking follow status');
      this.followButtonText = 'Follow';
      this.followStatus = false;
      for (let i = 0; i < user.following.length; i++) {
        if (user.following[i] === this.user.username) {
          this.followButtonText = 'Unfollow';
          this.followStatus = true;
          break;
        }
      }
    }
  }
}
