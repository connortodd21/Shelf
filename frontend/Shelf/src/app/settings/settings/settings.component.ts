import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  changePasswordForm: FormGroup;
  changePasswordSubmit = false;
  changeEmailForm: FormGroup;
  changeEmailSubmit = false;
  status: string;

  constructor(private formBuilder: FormBuilder, private settingsSerice: SettingsService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.checkPasswords });
    this.changeEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
    }, { validator: this.checkEmails });
  }

  changePassword(form) {
    this.changePasswordSubmit = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.settingsSerice.changePassword(form.value.password).then(res => {
      window.location.reload();
    }).catch(err => {
      this.status = 'passwordError';
    });
  }

  changeEmail(form) {
    this.changeEmailSubmit = true;
    if (this.changeEmailForm.invalid) {
      return;
    }
    this.settingsSerice.changeEmail(form.value.email).then(res => {
      window.location.reload();
    }).catch(err => {
      if (err.error.message === 'Email is already taken') {
        this.status = 'emailTaken';
      } else {
      this.status = 'emailError';
      }
    });
  }

  private checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  private checkEmails(group: FormGroup) {
    const email = group.controls.email.value;
    const confirmEmail = group.controls.confirmEmail.value;

    return email === confirmEmail ? null : { notSame: true };
  }

}
