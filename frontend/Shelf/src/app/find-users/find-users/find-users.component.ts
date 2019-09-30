import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ProfileService} from "../../profile/profile/profile.service";
import {ProfileModel} from "../../models/profile.model";


@Component({
  selector: 'app-find-users',
  templateUrl: './find-users.component.html',
  styleUrls: ['./find-users.component.scss']
})
export class FindUsersComponent implements OnInit {

  users;
  filterText: string;

  constructor(private router: Router, private profileService: ProfileService) { }

  ngOnInit() {

    this.profileService.getAllUsers().then(users => {
      this.users = users;
    });

  }




}
