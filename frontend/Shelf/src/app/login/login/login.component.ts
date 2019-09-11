import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth.data.model';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  email: string;
  username: string;
  password: string;
  isRegistering: boolean;
  birthday: string;
  subtitle: string;

  constructor(private router: Router, public loginService: LoginService, private messageService: MessageService) { }

  ngOnInit() {
    this.subtitle = 'Login!';
  }

  registerUser() {

    this.subtitle = 'Sign up!';

    const authData: AuthData = {username: this.username, password: this.password, email: this.email, birthday: this.birthday};

    if (this.isRegistering) {
      this.loginService.registerUser(authData).subscribe(
        () => {this.showRegistrationSuccess()},
          error => {this.showError(error.error.message)},
        );

    } else {
        this.isRegistering = !this.isRegistering;
      }

  }


  loginUser() {
    this.subtitle = 'Login!';

    if (!this.isRegistering) {

      this.loginService.loginUser(this.username, this.password).subscribe(
        response => {
          console.log(response)
        },
        error => {
          this.handleError(error);
        }

      );

    } else {
      this.isRegistering = !this.isRegistering;
    }
  }


  handleError(err: HttpErrorResponse) {
    if (err.error.message === 'Bad request: Login user data is incomplete') {
      this.showError('badRequest');
    } else if (err.error.message === 'Unauthorized: Password is incorrect') {
      this.showError('badPassword');
    } else if (err.error.message === 'Not Found: User does not exist') {
      this.showError('DNE');
    } else {
      this.showError('failed');
    }
  }


  showError(errorMessage = 'All fields must be filled out') {
    this.messageService.add({severity: 'error', summary: 'Error!', detail: errorMessage});
  }

  showRegistrationSuccess(successMessage = 'Registration successful!') {
    this.messageService.add({severity: 'success', summary: 'Success!', detail: successMessage});
  }


}
