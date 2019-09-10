import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    console.log('here');
  }

  registerUser() {
    console.log('begin');
    this.authService.registerUser('a@b.com', 'username', 'password', '2019-4-29').then( res => {
      console.log(res);
    });
  }

  loginUser() {
    console.log('attempting to login user');
  }

}
