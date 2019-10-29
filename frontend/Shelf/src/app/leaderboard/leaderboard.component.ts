import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile/profile.service'
import { ProfileModel } from '../models/profile.model'

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  userList: ProfileModel[];

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getTop10Users();
  }

  public getTop10Users() {
    this.profileService.getAllUsers().then(users => {
      let i: number;
      const response = [];

      response.push(users);

      this.userList = new Array(response[0].length);

      for (i = 0; i < response[0].length; i++) {
        const user = new ProfileModel(response[0][i]);
        this.userList[i] = user;
      }

      this.userList.sort((first, second) => {
        return ((first.followers.length * 2 + first.gamesRated.length) < (second.followers.length * 2 + second.gamesRated.length)) ? 1 : -1
      })
      while (this.userList.length > 10)
        this.userList.pop()
    });
  }
}
