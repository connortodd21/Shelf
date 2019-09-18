import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserModel;

  constructor(private route: ActivatedRoute, private profileService: ProfileService, private router: Router) { }

  ngOnInit() {
    // get username from url, check that it is valid username
    // if valid, display info
    // if not valid, return to home
    const username = this.route.snapshot.params.username;
    this.profileService.getUserData().then( res => {
      this.user = res;
    });
  }

}
