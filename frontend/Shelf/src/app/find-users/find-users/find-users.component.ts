import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import {ProfileService} from "../../profile/profile/profile.service";


@Component({
  selector: 'app-find-users',
  templateUrl: './find-users.component.html',
  styleUrls: ['./find-users.component.scss']
})
export class FindUsersComponent {
  filterText: string;
  users;


  constructor(private router: Router, private profileService: ProfileService) { }

  updateUserList() {
    console.log("updating user list")
    if (!this.filterText || this.filterText.length < 1) {
      this.users = [];
    }
    else {
      this.profileService.getUsersContaining(this.filterText).then(users => {
        console.log(users)
        this.users = users;
      });
    }
  }




}
