import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  isRegistering: boolean;
  date: string;

  constructor(private router: Router, public loginService: LoginService) { }

  ngOnInit() {
    console.log('login initialized');
  }

  registerUser() {
    console.log('username is: ' + this.username);
    console.log('password is: ' + this.password);
    this.isRegistering = !this.isRegistering;

    this.loginService.registerUser('a@b.com', 'username', 'password', '2019-4-29').then( res => {
      console.log(res);
    });
  }

  loginUser() {
    console.log('attempting to login user');
    console.log('username is: ' + this.username);
    console.log('password is: ' + this.password);

    this.isRegistering = false;
  }

}
