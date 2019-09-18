import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserModel } from '../../models/user.model';
import { ProfileModel } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserModel;
  allUsers: ProfileModel[];
  friends: string[];

  constructor(private route: ActivatedRoute, private profileService: ProfileService, private router: Router) { }

  ngOnInit() {
    const username = this.route.snapshot.params.username;
    this.profileService.getUserData(username).then(res => {
      this.user = res;
      this.friends = res.friends;
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

  public addFriend(user) {
    const confirm = window.confirm('Are you sure you want to add ' + user.username + ' as a friend?');
    if (confirm === false) {
      return;
    }
    this.profileService.addFriend(user.username).then( res => {
      window.location.reload();
    });
  }

}
