import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth.data.model';
import { MessageService } from 'primeng/api';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  error = 'NULL';
  forgotPasswordForm: FormGroup;
  forgotPasswordSubmit = false;
  verifyEmailForm: FormGroup;
  verifyEmailSubmit = false;
  //maxDate;

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, public loginService: LoginService, private messageService: MessageService, private formBuilder: FormBuilder, private modalService: NgbModal) {
    if (this.loginService.getAuthToken()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    // tslint:disable: one-line
    // let date = new Date();
    // this.maxDate = date.set;
    this.subtitle = 'Login!';
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', [Validators.required, CustomValidators.date]]
    }, { validator: this.checkPasswords });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.verifyEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      verificationNum: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  setIsRegistering(value: boolean) {
    this.isRegistering = value;
  }

  registerUser(form) {

    this.subtitle = 'Sign up!';
    this.registerSubmit = true;
    if (this.registerForm.invalid) {
      return;
    }
    // tslint:disable-next-line: max-line-length
    const authData: AuthData = { username: form.value.username, password: form.value.password, email: form.value.email, birthday: form.value.birthday };
    if (this.isRegistering) {
      this.loginService.registerUser(authData).subscribe(
        (res) => {
          console.log(res);
          this.showRegistrationSuccess();
          this.isRegistering = false;
        },
        error => {
          console.log(error);
          this.showError(error.error.message);
          if (error.error.message === 'Conflict: Email already exists') {
            this.error = 'emailExists';
          }
          else if (error.error.message === 'Conflict: User already exists') {
            this.error = 'userAlreadyExists';
          }
          else {
            this.error = 'fatal';
          }
        },
      );
    } else {
      this.isRegistering = !this.isRegistering;
    }
  }


  loginUser(form) {
    this.loginSubmit = true;
    this.subtitle = 'Login!';
    if (this.loginForm.invalid) {
      return;
    }
    console.log(form.value);
    if (!this.isRegistering) {
      this.loginService.loginUser(form.value.username, form.value.password).subscribe(
        () => {
        },
        error => {
          console.log(error);
          this.error = error.error.message;
          if (error.error.message === 'Unauthorized: Password is incorrect') {
            this.error = 'unauthorized';
          }
          else if (error.error.message === 'Not Found: User does not exist') {
            this.error = 'userNotFound';
          }
          else if (error.error.message === 'Please verify your email before logging in') {
            this.error = 'notVerified';
          }
          else {
            this.error = 'fatal';
          }
        }
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

  private checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);
    }).catch(err => {

    });

  }

  forgotPassword(form) {
    this.forgotPasswordSubmit = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loginService.forgotPassword(form.value.email).then(
      response => {
      }).catch(
        error => {
          this.error = error.error.message;
          if (error.error.message === 'Email does not exist.') {
            this.error = 'emailNotFound';
          }
          else {
            this.error = 'fatalModal';
          }
        });

   this.modalService.dismissAll()
  }

  verifyEmail(form) {
    console.log(form);
    this.verifyEmailSubmit = true;
    if (this.verifyEmailForm.invalid) {
      return;
    }
    this.loginService.verifyEmail(form.value.email, form.value.verificationNum).then(res => {
      this.modalService.dismissAll()
    }).catch(error => {
      console.log(this.error);
      this.error = error.error.message;
      if (error.error.message === 'Email does not exist.') {
        this.error = 'emailNotFound';
      }
      else if (error.error.message === 'Verification code does not match') {
        this.error = 'wrongVerificationNum';
      }
      else if (error.error.message === 'Email not found in database') {
        this.error = 'probablyWrongEmail';
      }
      else {
        this.error = 'fatalVerifyModal';
      }
    });
  }
}
