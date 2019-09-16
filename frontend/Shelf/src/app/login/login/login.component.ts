import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth.data.model';
import { MessageService } from 'primeng/api';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  loginForm: FormGroup;
  loginSubmit = false;
  registerForm: FormGroup;
  registerSubmit = false;


  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, public loginService: LoginService, private messageService: MessageService, private formBuilder: FormBuilder) {
    if (this.loginService.getAuthToken()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.subtitle = 'Login!';
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [ Validators.required, Validators.minLength(8) ]],
      confirmPassword: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email ]],
      birthday: ['', Validators.required]
    }, { validator: this.checkPasswords } );
  }

  setIsRegistering(value: boolean) {
    this.isRegistering = value;
  }

  registerUser(form: NgForm) {

    this.subtitle = 'Sign up!';
    this.registerSubmit = true;
    if (this.registerForm.invalid) {
      return;
    }
    // tslint:disable-next-line: max-line-length
    const authData: AuthData = { username: form.value.username, password: form.value.password, email: form.value.email, birthday: form.value.birthday };

    if (this.isRegistering) {
      this.loginService.registerUser(authData).subscribe(
        () => { this.showRegistrationSuccess(); },
        error => { this.showError(error.error.message); },
      );
    } else {
      this.isRegistering = !this.isRegistering;
    }
  }


  loginUser(form: NgForm) {
    this.loginSubmit = true;
    this.subtitle = 'Login!';
    if (this.loginForm.invalid) {
      return;
    }
    if (!this.isRegistering) {
      this.loginService.loginUser(form.value.username, form.value.password).subscribe(
        response => {
        },
        error => {this.showError(error.error.message); }
      );
    } else {
      this.isRegistering = !this.isRegistering;
    }
  }

  showError(errorMessage = 'All fields must be filled out') {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail: errorMessage });
  }

  showRegistrationSuccess(successMessage = 'Registration successful!') {
    this.messageService.add({ severity: 'success', summary: 'Success!', detail: successMessage });
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }
}
